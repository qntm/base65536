/** Tests for base65536, ensure strings survive round trips, etc. */

'use strict'

import * as fs from 'fs'

import base65536 from './../lib/index' // test the built JS file

const arrayBuffersEqual = (expected, actual) => {
  expected = new Uint8Array(expected)
  actual = new Uint8Array(actual)

  expect(actual.length).toBe(expected.length)

  for (let i = 0; i < actual.byteLength; i++) {
    const expectedByte = expected[i]
    const actualByte = actual[i]
    expect(actualByte).toBe(expectedByte)
  }
}

describe('base65536', function () {
  describe('success cases', function () {
    const caseDir = './node_modules/base65536-test/data/pairs'
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
          const binary = new Uint8Array(fs.readFileSync(binaryFileName)).buffer
          const text = fs.readFileSync(textFileName, 'utf8')
          expect(base65536.encode(binary)).toBe(text)
        })
      })
    })

    describe('decode', function () {
      caseNames.forEach(function (caseName) {
        const textFileName = caseName + '.txt'
        const binaryFileName = caseName + '.bin'

        it(textFileName + ' to ' + binaryFileName, function () {
          const text = fs.readFileSync(textFileName, 'utf8')
          const binary = new Uint8Array(fs.readFileSync(binaryFileName)).buffer
          arrayBuffersEqual(binary, base65536.decode(text))
        })
      })
    })

    describe('ignoreGarbage', function () {
      const caseDir = './node_modules/base65536-test/data/ignoreGarbage'
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
              base65536.decode(text)
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
              base65536.decode(text, false)
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
            const binary = new Uint8Array(fs.readFileSync(binaryFileName)).buffer
            arrayBuffersEqual(binary, base65536.decode(text, true))
          })
        })
      })
    })

    describe('wrap', function () {
      const caseDir = './node_modules/base65536-test/data/wrap'
      let wrapCases = [
        {wrap: 1, cases: ['empty', 'hatetris-wr']},
        {wrap: 2, cases: ['empty', 'hatetris-wr-rle']},
        {wrap: 4, cases: ['empty', 'hatetris-wr-rle2']},
        {wrap: 5, cases: ['demo', 'empty']},
        {wrap: 76, cases: ['empty', 'everyByte']},
        {wrap: 140, cases: ['empty', 'lena_std.tif']},
        {wrap: 256, cases: ['empty', 'everyPairOfBytes']},
        {wrap: 1000, cases: ['empty', 'everyPairOfBytes']}
      ]
      wrapCases = wrapCases.map(function (wrapCase) {
        return {
          wrap: wrapCase.wrap,
          cases: wrapCase.cases.map(function (caseName) {
            return caseDir + '/' + String(wrapCase.wrap) + '/' + caseName
          })
        }
      })

      wrapCases.forEach(function (wrapCase) {
        describe(String(wrapCase.wrap), function () {
          wrapCase.cases.forEach(function (caseName) {
            const textFileName = caseName + '.txt'
            const binaryFileName = caseName + '.bin'
            it(textFileName + ' to ' + binaryFileName, function () {
              const text = fs.readFileSync(textFileName, 'utf8')
              const binary = new Uint8Array(fs.readFileSync(binaryFileName)).buffer
              expect(base65536.encode(binary, wrapCase.wrap)).toBe(text)
              arrayBuffersEqual(binary, base65536.decode(text, true))
            })
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
    const caseDir = './node_modules/base65536-test/data/bad'
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
            base65536.decode(text)
          }).toThrow()
        })
      })
    })
  })
})
