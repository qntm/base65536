// This module's purpose is to generate 65,792 "safe" <https://qntm.org/safe>
// Unicode code points suitable for use in the Base65536 encoding. It makes use
// of the sibling package `safe-code-point`
// <https://github.com/qntm/safe-code-point>.

// 65,792 is 2**16 + 2**8. Each code point in the initial collection of 2**16
// code points encodes 16 bits, i.e., a distinct possible pair of bytes. The
// extra 2**8 code points are needed to encode 8 bits of the single final byte
// in cases where the binary data runs for an odd number of bytes.

// Rather than generate thousands and thousands of arbitrary safe code points,
// this module simplifies matters by finding 256 + 1 contiguous, aligned blocks
// of 256 safe code points. This means the last 8 bits of the code point can be
// decoded directly to an encoded byte, and the lookup table to decode the other
// byte (if any) is relatively small.

// This program was run only once, with the successful results immediately
// transplanted into `base65536` for use. It is kept here for historical reasons
// and to ensure reproducibility.

import safeCodePoint, { generalCategory } from '../../../../non-npm/safe-code-point'

const safeRange = (min, max) => {
  for (let codePoint = min; codePoint < max; codePoint++) {
    // Code points were chosen entirely from the "Letter, other" general
    // category, for reasons which I no longer recall. Unicode 8.0 was current
    // at the time.
    if (
      generalCategory(codePoint, '8.0') !== 'Lo' ||
      !safeCodePoint(codePoint, '8.0')
    ) {
      return false
    }
  }
  return true
}

const getAllSafeRanges = rangeSize => {
  const allSafeRanges = []
  for (let codePoint = 0; codePoint < (1 << 16) + (1 << 20); codePoint += rangeSize) {
    if (safeRange(codePoint, codePoint + rangeSize)) {
      allSafeRanges.push(codePoint)
    }
  }
  return allSafeRanges
}

const allSafeRanges = getAllSafeRanges(1 << 8)

export const paddingBlockStart = String.fromCodePoint(allSafeRanges.shift())

export const blockStarts = allSafeRanges.slice(0, 1 << 8).map(x => String.fromCodePoint(x)).join('')

// There are now implementations of
// Base65536 in numerous programming languages beyond the original JavaScript,
// and I consider it *extremely* undesirable to introduce multiple incompatible
// versions of the Base65536 encoding, so this program is unlikely to ever be
// run again unless a very serious problem is discovered.

// Still, if I tried this again, here are some things I might do differently:

// * Include other safe Unicode General Categories, so that Base65536 output
// does not seemingly consist only of CJK characters. At present, to my eye (not
// being a reader of those languages) it resembles ordinary CJK text. I would
// prefer Base65536 to be more obviously a kludge of diverse scripts, so that it
// can't be mistaken for text, even by someone who knows none of those scripts.
// Naturally the lion's share of code points will have to remain CJK though,
// that's just where the safe code points mostly are.
// * Try harder to select lower code points, those with 3-byte encodings in
// UTF-8 and 2-byte encodings in UTF-16, to reduce the average size of the
// encoded Base65536 output (even though Base65536 is optimised for UTF-32).
// * Perhaps try to find larger blocks of 512 or 1024 code points rather than
// 256, or other techniques for reducing the size of the lookup tables.
// * Choose all characters with the same East_Asian_Width of 'W' (wide).
