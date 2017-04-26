/** Tests for base65536, ensure strings survive round trips, etc. */

/* eslint-env jasmine */

var base65536 = require('./../src/index.js')
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
      'sample-files/lena_std.tif'
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

    describe('normalization', function () {
      var forms = ['NFC', 'NFD', 'NFKC', 'NFKD']
      caseNames.forEach(function (caseName) {
        var textFileName = caseName + '.txt'
        forms.forEach(function (form) {
          it(textFileName + ' survives ' + form + ' normalization', function () {
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
      'rogueEndOfStreamChar'
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
