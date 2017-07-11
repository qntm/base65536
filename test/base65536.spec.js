/** Tests for base65536, ensure strings survive round trips, etc. */
'use strict';
var base65536 = require('./../dist/base65536.js'); // test the built JS file
var base65536min = require('./../dist/base65536.min.js');
var fs = require('fs');
var modules = {
    base65536: base65536,
    base65536min: base65536min
};
Object.keys(modules).forEach(function (moduleName) {
    var module = modules[moduleName];
    describe(moduleName, function () {
        describe('success cases', function () {
            var caseDir = './data/pairs';
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
                        var binary = fs.readFileSync(binaryFileName);
                        var text = fs.readFileSync(textFileName, 'utf8');
                        expect(module.encode(binary)).toBe(text);
                    });
                });
            });
            describe('decode', function () {
                caseNames.forEach(function (caseName) {
                    var textFileName = caseName + '.txt';
                    var binaryFileName = caseName + '.bin';
                    it(textFileName + ' to ' + binaryFileName, function () {
                        var text = fs.readFileSync(textFileName, 'utf8');
                        var binary = fs.readFileSync(binaryFileName);
                        expect(module.decode(text).equals(binary)).toBe(true);
                    });
                });
            });
            describe('ignoreGarbage', function () {
                var caseDir = './data/ignoreGarbage';
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
                                module.decode(text);
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
                                module.decode(text, false);
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
                            var binary = fs.readFileSync(binaryFileName);
                            expect(module.decode(text, true).equals(binary)).toBe(true);
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
            var caseDir = './data/bad';
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
                            module.decode(text);
                        }).toThrow();
                    });
                });
            });
        });
    });
});
