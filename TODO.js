// Use this to greatly shrink the data section...

const repertoires0 = repertoires.map(repertoire => {
  let str = ''
  ;[...repertoire]
    .map(chr => chr.codePointAt(0))
    .forEach((codePoint, i, codePoints) => {
      if (i === 0) {
        str += String.fromCodePoint(codePoint)
      } else if (i === codePoints.length - 1) {
        str += String.fromCodePoint(codePoint + 1)
      } else if (codePoint !== codePoints[i - 1] + 1) {
        str += String.fromCodePoint(codePoints[i - 1] + 1)
        str += String.fromCodePoint(codePoint)
      }
    })
  return str
})

console.log(repertoires0)

console.log('a{0:'.replace(/../gu, pair => {
	const first = pair.codePointAt(0)
	const last = pair.codePointAt(1)
	let output = ''
	for (let j = first; j < last; j++) {
		output += String.fromCodePoint(j)
	}
	return output
}))
