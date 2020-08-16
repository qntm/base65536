// I want to write '..' here, but I can't figure out a way to get Babel to
// follow `package.json`'s "module" property instead of its "main" property
import { encode, decode } from '../dist/es6/base65536'

const before = [1, 2, 3]
const after = Array.from(decode(encode(Uint8Array.from(before))))

if (JSON.stringify(after) !== JSON.stringify(before)) {
  throw Error()
}
