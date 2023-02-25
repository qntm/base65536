import assert from 'node:assert'
import fs from 'node:fs'
import { describe, it } from 'mocha'
import glob from 'glob'
import { encode, decode } from '../src/index.js'

const forms = ['NFC', 'NFD', 'NFKC', 'NFKD']

describe('base65536', () => {
  describe('success cases', () => {
    const binFileNames = glob.sync('./node_modules/base65536-test/data/pairs/**/*.bin')

    binFileNames.forEach(fileName => {
      const caseName = fileName.substring(0, fileName.length - '.bin'.length)
      it(caseName, () => {
        const uint8Array = new Uint8Array(fs.readFileSync(caseName + '.bin'))
        const text = fs.readFileSync(caseName + '.txt', 'utf8')
        assert.strictEqual(encode(uint8Array), text)
        assert.deepStrictEqual(decode(text), uint8Array)
        forms.forEach(form => {
          assert.strictEqual(text.normalize(form), text)
        })
      })
    })
  })

  describe('failure cases', () => {
    const badFileNames = glob.sync('./node_modules/base65536-test/data/bad/**/*.txt')

    badFileNames.forEach(fileName => {
      const caseName = fileName.substring(0, fileName.length - '.txt'.length)
      it(caseName, () => {
        const text = fs.readFileSync(caseName + '.txt', 'utf8')
        assert.throws(() => decode(text))
      })
    })
  })

  describe('round trips at all lengths', () => {
    const fillUint8s = [
      0b00000000,
      0b00000001,
      0b01010101,
      0b10101010,
      0b11111111
    ]
    for (let length = 0; length < 256; length++) {
      fillUint8s.forEach(fillUint8 => {
        it(`every uint8 is ${fillUint8} to length ${length}`, () => {
          const uint8Array = new Uint8Array(length)
          for (let i = 0; i < length; i++) {
            uint8Array[i] = fillUint8
          }

          assert.deepStrictEqual(uint8Array, decode(encode(uint8Array)))
        })
      })
    }
  })

  it('demo code', () => {
    const ascii = 'some ASCII text'
    const uint8Array = Uint8Array.from(ascii, chr => chr.charCodeAt(0))
    const str = encode(uint8Array)
    const uint8Array2 = decode(str)
    const ascii2 = String.fromCharCode(...uint8Array2)
    assert.strictEqual(ascii2, 'some ASCII text')
  })

  it('bug', () => {
    const ascii = 'what the heck is up'
    const uint8Array = Uint8Array.from(ascii, chr => chr.charCodeAt(0))
    const str = encode(uint8Array)
    const uint8Array2 = decode(str)
    const ascii2 = String.fromCharCode(...uint8Array2)
    assert.strictEqual(ascii2, 'what the heck is up')
  })

  it('round trip to demonstrate padding behaviour', () => {
    assert.deepStrictEqual(encode(Uint8Array.from([0x00, 0x01, 0x02])), '㔀ᔂ')
    assert.deepStrictEqual(decode('㔀ᔂ'), Uint8Array.from([0x00, 0x01, 0x02]))
  })
})
