/** Tests for base65536, ensure strings survive round trips, etc. */
'use strict';
exports.__esModule = true;
var fs = require("fs");
var index_1 = require("./../lib/index"); // test the built JS file
var arrayBuffersEqual = function (expected, actual) {
    expected = new Uint8Array(expected);
    actual = new Uint8Array(actual);
    expect(actual.length).toBe(expected.length);
    for (var i = 0; i < actual.byteLength; i++) {
        var expectedByte = expected[i];
        var actualByte = actual[i];
        expect(actualByte).toBe(expectedByte);
    }
};
describe('base65536', function () {
    describe('success cases', function () {
        var caseDir = './node_modules/base65536-test/data/pairs';
        var caseNames = [
            'demo',
            'firstDefect',
            'hatetris-wrs/hatetris-wr',
            'hatetris-wrs/hatetris-wr-rle',
            'hatetris-wrs/hatetris-wr-rle2',
            'sample-files/everyByte',
            'sample-files/everyPairOfBytes',
            'sample-files/lena_std.tif',
            'empty'
        ];
        for (var b = 0; b < 1 << 8; b++) {
            caseNames.push('single-bytes/case' + String(b));
        }
        for (var b = 0; b < 1 << 8; b++) {
            caseNames.push('doubled-bytes/case' + String(b) + '-' + String(b));
        }
        caseNames = caseNames.map(function (caseName) {
            return caseDir + '/' + caseName;
        });
        describe('encode', function () {
            caseNames.forEach(function (caseName) {
                var binaryFileName = caseName + '.bin';
                var textFileName = caseName + '.txt';
                it(binaryFileName + ' to ' + textFileName, function () {
                    var binary = new Uint8Array(fs.readFileSync(binaryFileName)).buffer;
                    var text = fs.readFileSync(textFileName, 'utf8');
                    expect(index_1["default"].encode(binary)).toBe(text);
                });
            });
        });
        describe('decode', function () {
            caseNames.forEach(function (caseName) {
                var textFileName = caseName + '.txt';
                var binaryFileName = caseName + '.bin';
                it(textFileName + ' to ' + binaryFileName, function () {
                    var text = fs.readFileSync(textFileName, 'utf8');
                    var binary = new Uint8Array(fs.readFileSync(binaryFileName)).buffer;
                    arrayBuffersEqual(binary, index_1["default"].decode(text));
                });
            });
        });
        describe('ignoreGarbage', function () {
            var caseDir = './node_modules/base65536-test/data/ignoreGarbage';
            var caseNames = [
                'abc',
                'continuationAtEnd',
                'lineBreak',
                'lineBreaks',
                'quoted',
                'randomAlphanumericInterference',
                'spaceAfter',
                'spaceBefore',
                'spacesEverywhere'
            ];
            caseNames = caseNames.map(function (caseName) {
                return caseDir + '/' + caseName;
            });
            describe('by default', function () {
                caseNames.forEach(function (caseName) {
                    var textFileName = caseName + '.txt';
                    it('fails to decode ' + textFileName, function () {
                        var text = fs.readFileSync(textFileName, 'utf8');
                        expect(function () {
                            index_1["default"].decode(text);
                        }).toThrow();
                    });
                });
            });
            describe('`false`', function () {
                caseNames.forEach(function (caseName) {
                    var textFileName = caseName + '.txt';
                    it('fails to decode ' + textFileName, function () {
                        var text = fs.readFileSync(textFileName, 'utf8');
                        expect(function () {
                            index_1["default"].decode(text, false);
                        }).toThrow();
                    });
                });
            });
            describe('`true`', function () {
                caseNames.forEach(function (caseName) {
                    var textFileName = caseName + '.txt';
                    var binaryFileName = caseName + '.bin';
                    it('successfully decodes ' + textFileName, function () {
                        var text = fs.readFileSync(textFileName, 'utf8');
                        var binary = new Uint8Array(fs.readFileSync(binaryFileName)).buffer;
                        arrayBuffersEqual(binary, index_1["default"].decode(text, true));
                    });
                });
            });
        });
        describe('wrap', function () {
            var caseDir = './node_modules/base65536-test/data/wrap';
            var wrapCases = [
                { wrap: 1, cases: ['empty', 'hatetris-wr'] },
                { wrap: 2, cases: ['empty', 'hatetris-wr-rle'] },
                { wrap: 4, cases: ['empty', 'hatetris-wr-rle2'] },
                { wrap: 5, cases: ['demo', 'empty'] },
                { wrap: 76, cases: ['empty', 'everyByte'] },
                { wrap: 140, cases: ['empty', 'lena_std.tif'] },
                { wrap: 256, cases: ['empty', 'everyPairOfBytes'] },
                { wrap: 1000, cases: ['empty', 'everyPairOfBytes'] }
            ];
            wrapCases = wrapCases.map(function (wrapCase) {
                return {
                    wrap: wrapCase.wrap,
                    cases: wrapCase.cases.map(function (caseName) {
                        return caseDir + '/' + String(wrapCase.wrap) + '/' + caseName;
                    })
                };
            });
            wrapCases.forEach(function (wrapCase) {
                describe(String(wrapCase.wrap), function () {
                    wrapCase.cases.forEach(function (caseName) {
                        var textFileName = caseName + '.txt';
                        var binaryFileName = caseName + '.bin';
                        it(textFileName + ' to ' + binaryFileName, function () {
                            var text = fs.readFileSync(textFileName, 'utf8');
                            var binary = new Uint8Array(fs.readFileSync(binaryFileName)).buffer;
                            expect(index_1["default"].encode(binary, wrapCase.wrap)).toBe(text);
                            arrayBuffersEqual(binary, index_1["default"].decode(text, true));
                        });
                    });
                });
            });
        });
        var forms = ['NFC', 'NFD', 'NFKC', 'NFKD'];
        forms.forEach(function (form) {
            describe(form + ' normalization', function () {
                caseNames.forEach(function (caseName) {
                    var textFileName = caseName + '.txt';
                    it(textFileName + ' survives', function () {
                        var text = fs.readFileSync(textFileName, 'utf8');
                        expect(text.normalize(form)).toBe(text);
                    });
                });
            });
        });
    });
    describe('failure cases', function () {
        var caseDir = './node_modules/base65536-test/data/bad';
        var caseNames = [
            'abc',
            'endOfStreamBeginsStream',
            'endOfStreamMidStream',
            'endOfStreamMidStreamEarlier',
            'eosThenJunk',
            'junkOnEnd',
            'lineBreak',
            'rogueEndOfStreamChar',
            'twoEndsOfStream'
        ].map(function (caseNames) {
            return caseDir + '/' + caseNames;
        });
        describe('cannot decode', function () {
            caseNames.forEach(function (caseName) {
                var textFileName = caseName + '.txt';
                it(textFileName, function () {
                    var text = fs.readFileSync(textFileName, 'utf8');
                    expect(function () {
                        index_1["default"].decode(text);
                    }).toThrow();
                });
            });
        });
    });
});
