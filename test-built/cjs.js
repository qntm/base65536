const { encode, decode } = require('..')

const before = [1, 2, 3]
const after = Array.from(decode(encode(Uint8Array.from(before))))

if (JSON.stringify(after) !== JSON.stringify(before)) {
  throw Error()
}
