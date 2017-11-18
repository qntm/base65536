/**
 * Routines for converting binary data into text data which can be sent safely
 * through 'Unicode-clean' text systems without information being lost. Analogous
 * to Base64 with a significantly larger character repertoire enabling the
 * encoding of 2.00 bytes per character (for comparison, Base64 manages 0.75 bytes
 * per character).
 */

'use strict'

import { createEncodeStream, createDecodeStream } from 'base65536-stream'

export { createEncodeStream, createDecodeStream }

// Encode the supplied `Buffer` and return the resulting Base65536
// string.
export const encode = function (buf: Buffer, wrap: number = Infinity) {
  const encodeStream = createEncodeStream(wrap)
  const strs: string[] = []
  encodeStream.on('data', function (chunk: string) {
    strs.push(chunk)
  })
  encodeStream.write(buf)
  encodeStream.end()
  return strs.join('')
}

export const decode = function (str: string, ignoreGarbage: boolean = false) {
  const decodeStream = createDecodeStream(ignoreGarbage)
  const buffers: Buffer[] = []
  decodeStream.on('data', function (chunk: Buffer) {
    buffers.push(chunk)
  })
  decodeStream.on('error', function (err) {
    throw err
  })
  decodeStream.write(str)
  decodeStream.end()
  return Buffer.concat(buffers)
}
