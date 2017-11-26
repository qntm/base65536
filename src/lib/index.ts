/**
 * Routines for converting binary data into text data which can be sent safely
 * through 'Unicode-clean' text systems without information being lost. Analogous
 * to Base64 with a significantly larger character repertoire enabling the
 * encoding of 2.00 bytes per character (for comparison, Base64 manages 0.75 bytes
 * per character).
 */

'use strict'

// Some constants for UTF-16 encoding/decoding of
// code points outside the BMP

// Code points outside of the BMP are from 65536 to
// 1114111, so we subtract this figure to make them
// from 0 to 1048575, 20 bits.
const bmpThreshold = 1 << 16

// 10 most significant bits go in the high surrogate,
// the rest in the low surrogate
const offset = 1 << 10

// High surrogate. Lowest 10 bits are free
const high = 0xD800

// Low surrogate. Lowest 10 bits are free. So a
// high surrogate and a low surrogate between them
// can encode 20 bits.
const low = 0xDC00

// Because the spread operator isn't universal. :-/
// Return code points directly instead of individual
// characters to save some steps
const spreadString = (str: string) => {
  const codePoints: number[] = []
  let i = 0
  while (i < str.length) {
    const first = str.charCodeAt(i)
    i++
    if (high <= first && first < high + offset) {
      // UTF-16 decode
      const second = str.charCodeAt(i)
      i++
      if (low <= second && second < low + offset) {
        codePoints.push((first - high) * offset + (second - low) + bmpThreshold)
      } else {
        throw Error('Invalid UTF-16')
      }
    } else {
      codePoints.push(first)
    }
  }
  return codePoints
}

const unspreadString = (codePoints: number[]) => {
  return codePoints.map(codePoint => {
    if (codePoint < bmpThreshold) {
      return String.fromCharCode(codePoint)
    }

    // UTF-16 post-BMP encode
    const first = high + ((codePoint - bmpThreshold) / offset)
    const second = low + (codePoint % offset)
    return String.fromCharCode(first) + String.fromCharCode(second)
  }).join('')
}

const paddingBlockStart = spreadString('ᔀ')[0]
const blockStarts = spreadString(
  '㐀㔀㘀㜀㠀㤀㨀㬀㰀㴀㸀㼀䀀䄀䈀䌀' +
  '䐀䔀䘀䜀䠀䤀䨀䬀䰀一伀倀儀刀匀吀' +
  '唀嘀圀堀夀娀嬀尀崀帀开怀愀戀挀搀' +
  '攀昀最栀椀樀欀氀洀渀漀瀀焀爀猀琀' +
  '甀瘀眀砀礀稀笀簀紀縀缀耀脀舀茀萀' +
  '蔀蘀蜀蠀褀言謀谀贀踀輀退鄀鈀錀鐀' +
  '销阀需頀餀騀鬀鰀鴀鸀ꄀꈀꌀꔀ𐘀𒀀' +
  '𒄀𒈀𓀀𓄀𓈀𓌀𔐀𔔀𖠀𖤀𠀀𠄀𠈀𠌀𠐀𠔀' +
  '𠘀𠜀𠠀𠤀𠨀𠬀𠰀𠴀𠸀𠼀𡀀𡄀𡈀𡌀𡐀𡔀' +
  '𡘀𡜀𡠀𡤀𡨀𡬀𡰀𡴀𡸀𡼀𢀀𢄀𢈀𢌀𢐀𢔀' +
  '𢘀𢜀𢠀𢤀𢨀𢬀𢰀𢴀𢸀𢼀𣀀𣄀𣈀𣌀𣐀𣔀' +
  '𣘀𣜀𣠀𣤀𣨀𣬀𣰀𣴀𣸀𣼀𤀀𤄀𤈀𤌀𤐀𤔀' +
  '𤘀𤜀𤠀𤤀𤨀𤬀𤰀𤴀𤸀𤼀𥀀𥄀𥈀𥌀𥐀𥔀' +
  '𥘀𥜀𥠀𥤀𥨀𥬀𥰀𥴀𥸀𥼀𦀀𦄀𦈀𦌀𦐀𦔀' +
  '𦘀𦜀𦠀𦤀𦨀𦬀𦰀𦴀𦸀𦼀𧀀𧄀𧈀𧌀𧐀𧔀' +
  '𧘀𧜀𧠀𧤀𧨀𧬀𧰀𧴀𧸀𧼀𨀀𨄀𨈀𨌀𨐀𨔀'
)

const possibleBytes = 1 << 8

interface IB2s {
  // This should say `number` but:
  // <https://github.com/palantir/tslint/issues/2944>
  // <https://github.com/Microsoft/TypeScript/issues/13778>
  [key: string]: number | undefined
}

const b2s: IB2s = {}
for (let b = 0; b < possibleBytes; b++) {
  b2s[blockStarts[b]] = b
}

export const encode = (arrayBuffer: ArrayBuffer, wrap: number = Infinity) => {
  const uint8Array = new Uint8Array(arrayBuffer)

  let oddByte: undefined|number

  const codePoints: number[] = []

  for (let i = 0; i < uint8Array.length; i++) {
    if (oddByte === undefined) {
      oddByte = uint8Array[i]
    } else {
      codePoints.push(blockStarts[uint8Array[i]] + oddByte)
      oddByte = undefined
    }
  }

  if (oddByte !== undefined) {
    codePoints.push(paddingBlockStart + oddByte)
    oddByte = undefined
  }

  for (let i = wrap; i < codePoints.length; i += wrap + 1) {
    codePoints.splice(i, 0, 0x0A)
  }

  return unspreadString(codePoints)
}

export const decode = (str: string, ignoreGarbage: boolean = false) => {
  let done: boolean = false

  const bytes: number[] = []

  spreadString(str).forEach(codePoint => {
    const b1 = codePoint & (possibleBytes - 1)
    const blockStart = codePoint - b1
    if (blockStart === paddingBlockStart) {
      if (done) {
        throw Error('Base65536 sequence continued after final byte')
      }
      bytes.push(b1)
      done = true
    } else {
      const b2 = b2s[blockStart]
      if (b2 !== undefined) {
        if (done) {
          throw Error('Base65536 sequence continued after final byte')
        }
        bytes.push(b1, b2)
      } else if (!ignoreGarbage) {
        throw Error('Not a valid Base65536 code point: ' + String(codePoint))
      }
    }
  })

  const uint8Array = new Uint8Array(bytes)

  const arrayBuffer = uint8Array.buffer

  return arrayBuffer
}

export default {encode, decode}
