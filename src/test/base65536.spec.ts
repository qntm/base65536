/** Tests for base65536, ensure strings survive round trips, etc. */

'use strict'

const base65536 = require('./../dist/base65536.js') // test the built JS file
const base65536min = require('./../dist/base65536.min.js')
const fs = require('fs')

const modules = {
  base65536: base65536,
  base65536min: base65536min
}

Object.keys(modules).forEach(function (moduleName) {
  const module = modules[moduleName]

  describe(moduleName, function () {
    describe('success cases', function () {
      const caseDir = './data/pairs'
      let caseNames = [
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
      for (let b = 0; b < 1 << 8; b++) {
        caseNames.push('single-bytes/case' + String(b))
      }
      for (let b = 0; b < 1 << 8; b++) {
        caseNames.push('doubled-bytes/case' + String(b) + '-' + String(b))
      }

      caseNames = caseNames.map(function (caseName) {
        return caseDir + '/' + caseName
      })

      describe('encode', function () {
        caseNames.forEach(function (caseName) {
          const binaryFileName = caseName + '.bin'
          const textFileName = caseName + '.txt'

          it(binaryFileName + ' to ' + textFileName, function () {
            const binary = fs.readFileSync(binaryFileName)
            const text = fs.readFileSync(textFileName, 'utf8')
            expect(module.encode(binary)).toBe(text)
          })
        })
      })

      describe('decode', function () {
        caseNames.forEach(function (caseName) {
          const textFileName = caseName + '.txt'
          const binaryFileName = caseName + '.bin'

          it(textFileName + ' to ' + binaryFileName, function () {
            const text = fs.readFileSync(textFileName, 'utf8')
            const binary = fs.readFileSync(binaryFileName)
            expect(module.decode(text).equals(binary)).toBe(true)
          })
        })
      })

      describe('ignoreGarbage', function () {
        const caseDir = './data/ignoreGarbage'
        let caseNames = [
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
            const textFileName = caseName + '.txt'
            it('fails to decode ' + textFileName, function () {
              const text = fs.readFileSync(textFileName, 'utf8')
              expect(function () {
                module.decode(text)
              }).toThrow()
            })
          })
        })

        describe('`false`', function () {
          caseNames.forEach(function (caseName) {
            const textFileName = caseName + '.txt'
            it('fails to decode ' + textFileName, function () {
              const text = fs.readFileSync(textFileName, 'utf8')
              expect(function () {
                module.decode(text, false)
              }).toThrow()
            })
          })
        })

        describe('`true`', function () {
          caseNames.forEach(function (caseName) {
            const textFileName = caseName + '.txt'
            const binaryFileName = caseName + '.bin'
            it('successfully decodes ' + textFileName, function () {
              const text = fs.readFileSync(textFileName, 'utf8')
              const binary = fs.readFileSync(binaryFileName)
              expect(module.decode(text, true).equals(binary)).toBe(true)
            })
          })
        })
      })

      const forms = ['NFC', 'NFD', 'NFKC', 'NFKD']
      forms.forEach(function (form) {
        describe(form + ' normalization', function () {
          caseNames.forEach(function (caseName) {
            const textFileName = caseName + '.txt'
            it(textFileName + ' survives', function () {
              const text = fs.readFileSync(textFileName, 'utf8')
              expect(text.normalize(form)).toBe(text)
            })
          })
        })
      })
    })

    describe('failure cases', function () {
      const caseDir = './data/bad'
      const caseNames = [
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
          const textFileName = caseName + '.txt'
          it(textFileName, function () {
            const text = fs.readFileSync(textFileName, 'utf8')
            expect(function () {
              module.decode(text)
            }).toThrow()
          })
        })
      })
    })
  })
})
