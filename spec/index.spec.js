/** Tests for base65536, ensure strings survive round trips, etc. */

/* eslint-env jasmine */

var base65536 = require('./../dist/base65536.js') // test the built JS file
var fs = require('fs')

describe('base65536', function () {
  describe('success cases', function () {
    var caseDir = './spec/pairs'
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
    ]
    var b
    for (b = 0; b < 1 << 8; b++) {
      caseNames.push('single-bytes/case' + String(b))
    }
    for (b = 0; b < 1 << 8; b++) {
      caseNames.push('doubled-bytes/case' + String(b) + '-' + String(b))
    }

    caseNames = caseNames.map(function (caseName) {
      return caseDir + '/' + caseName
    })

    describe('encode', function () {
      caseNames.forEach(function (caseName) {
        var binaryFileName = caseName + '.bin'
        var textFileName = caseName + '.txt'

        it(binaryFileName + ' to ' + textFileName, function () {
          var binary = fs.readFileSync(binaryFileName)
          var text = fs.readFileSync(textFileName, 'utf8')
          expect(base65536.encode(binary)).toBe(text)
        })
      })
    })

    describe('decode', function () {
      caseNames.forEach(function (caseName) {
        var textFileName = caseName + '.txt'
        var binaryFileName = caseName + '.bin'

        it(textFileName + ' to ' + binaryFileName, function () {
          var text = fs.readFileSync(textFileName, 'utf8')
          var binary = fs.readFileSync(binaryFileName)
          expect(base65536.decode(text).equals(binary)).toBe(true)
        })
      })
    })

    describe('ignoreGarbage', function () {
      var caseDir = './spec/ignoreGarbage'
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
      ]
      caseNames = caseNames.map(function (caseName) {
        return caseDir + '/' + caseName
      })

      describe('by default', function () {
        caseNames.forEach(function (caseName) {
          var textFileName = caseName + '.txt'
          it('fails to decode ' + textFileName, function () {
            var text = fs.readFileSync(textFileName, 'utf8')
            expect(function () {
              base65536.decode(text)
            }).toThrow()
          })
        })
      })

      describe('`false`', function () {
        caseNames.forEach(function (caseName) {
          var textFileName = caseName + '.txt'
          it('fails to decode ' + textFileName, function () {
            var text = fs.readFileSync(textFileName, 'utf8')
            expect(function () {
              base65536.decode(text, false)
            }).toThrow()
          })
        })
      })

      describe('`true`', function () {
        caseNames.forEach(function (caseName) {
          var textFileName = caseName + '.txt'
          var binaryFileName = caseName + '.bin'
          it('fails to decode ' + textFileName, function () {
            var text = fs.readFileSync(textFileName, 'utf8')
            var binary = fs.readFileSync(binaryFileName)
            expect(base65536.decode(text, true).equals(binary)).toBe(true)
          })
        })
      })
    })

    var forms = ['NFC', 'NFD', 'NFKC', 'NFKD']
    forms.forEach(function (form) {
      describe(form + ' normalization', function () {
        caseNames.forEach(function (caseName) {
          var textFileName = caseName + '.txt'
          it(textFileName + ' survives', function () {
            var text = fs.readFileSync(textFileName, 'utf8')
            expect(text.normalize(form)).toBe(text)
          })
        })
      })
    })
  })

  describe('failure cases', function () {
    var caseDir = './spec/bad'
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
      return caseDir + '/' + caseNames
    })

    describe('cannot decode', function () {
      caseNames.forEach(function (caseName) {
        var textFileName = caseName + '.txt'
        it(textFileName, function () {
          var text = fs.readFileSync(textFileName, 'utf8')
          expect(function () {
            base65536.decode(text)
          }).toThrow()
        })
      })
    })
  })
})
