# base65536

Base65536 is a binary encoding optimised for UTF-32-encoded text and Twitter. This JavaScript module, `base65536`, is the first implementation of this encoding.

Efficiency ratings are averaged over long inputs. Higher is better.

<table>
  <thead>
    <tr>
      <th colspan="2" rowspan="2">Encoding</th>
      <th colspan="3">Efficiency</th>
      <th rowspan="2">Bytes per Tweet *</th>
    </tr>
    <tr>
      <th>UTF&#x2011;8</th>
      <th>UTF&#x2011;16</th>
      <th>UTF&#x2011;32</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td rowspan="5">ASCII&#x2011;constrained</td>
      <td>Unary / <a href="https://github.com/ferno/base1">Base1</a></td>
      <td style="text-align: right;">0%</td>
      <td style="text-align: right;">0%</td>
      <td style="text-align: right;">0%</td>
      <td style="text-align: right;">1</td>
    </tr>
    <tr>
      <td>Binary</td>
      <td style="text-align: right;">13%</td>
      <td style="text-align: right;">6%</td>
      <td style="text-align: right;">3%</td>
      <td style="text-align: right;">35</td>
    </tr>
    <tr>
      <td>Hexadecimal</td>
      <td style="text-align: right;">50%</td>
      <td style="text-align: right;">25%</td>
      <td style="text-align: right;">13%</td>
      <td style="text-align: right;">140</td>
    </tr>
    <tr>
      <td>Base64</td>
      <td style="text-align: right;"><strong>75%</strong></td>
      <td style="text-align: right;">38%</td>
      <td style="text-align: right;">19%</td>
      <td style="text-align: right;">210</td>
    </tr>
    <tr>
      <td>Base85 †</td>
      <td style="text-align: right;">80%</td>
      <td style="text-align: right;">40%</td>
      <td style="text-align: right;">20%</td>
      <td style="text-align: right;">224</td>
    </tr>
    <tr>
      <td rowspan="4">BMP&#x2011;constrained</td>
      <td><a href="https://github.com/ferno/hexagram-encode">HexagramEncode</a></td>
      <td style="text-align: right;">25%</td>
      <td style="text-align: right;">38%</td>
      <td style="text-align: right;">19%</td>
      <td style="text-align: right;">105</td>
    </tr>
    <tr>
      <td><a href="https://github.com/ferno/braille-encode">BrailleEncode</a></td>
      <td style="text-align: right;">33%</td>
      <td style="text-align: right;">50%</td>
      <td style="text-align: right;">25%</td>
      <td style="text-align: right;">140</td>
    </tr>
    <tr>
      <td><a href="https://github.com/qntm/base2048">Base2048</a></td>
      <td style="text-align: right;">56%</td>
      <td style="text-align: right;">69%</td>
      <td style="text-align: right;">34%</td>
      <td style="text-align: right;"><strong>385</strong></td>
    </tr>
    <tr>
      <td><a href="https://github.com/ferno/base32768">Base32768</a></td>
      <td style="text-align: right;">63%</td>
      <td style="text-align: right;"><strong>94%</strong></td>
      <td style="text-align: right;">47%</td>
      <td style="text-align: right;">263</td>
    </tr>
    <tr>
      <td rowspan="3">Full Unicode</td>
      <td><a href="https://github.com/keith-turner/ecoji">Ecoji</a></td>
      <td style="text-align: right;">31%</td>
      <td style="text-align: right;">31%</td>
      <td style="text-align: right;">31%</td>
      <td style="text-align: right;">175</td>
    </tr>
    <tr>
      <td><a href="https://github.com/ferno/base65536">Base65536</a></td>
      <td style="text-align: right;">56%</td>
      <td style="text-align: right;">64%</td>
      <td style="text-align: right;"><strong>50%</strong></td>
      <td style="text-align: right;">280</td>
    </tr>
    <tr>
      <td><a href="https://github.com/ferno/base131072">Base131072</a> ‡</td>
      <td style="text-align: right;">53%+</td>
      <td style="text-align: right;">53%+</td>
      <td style="text-align: right;">53%</td>
      <td style="text-align: right;">297</td>
    </tr>
  </tbody>
</table>

\* New-style "long" Tweets, up to 280 Unicode characters give or take Twitter's complex "weighting" calculation.<br/>
† Base85 is listed for completeness but all variants use characters which are considered hazardous for general use in text: escape characters, brackets, punctuation *etc.*.<br/>
‡ Base131072 is a work in progress, not yet ready for general use.<br/>

For example, using Base64, up to 105 bytes of binary data can fit in a Tweet. With Base65536, 280 bytes are possible.

Base65536 uses only ["safe" Unicode code points](https://qntm.org/safe) - no unassigned code points, no whitespace, no control characters, etc..

## Installation

```bash
$ npm install base65536
```

## Usage

```js
const base65536 = require('base65536')

const uint8Array = new Uint8Array([104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100])

const string = base65536.encode(uint8Array.buffer); 
console.log(string); // 6 code points, '驨ꍬ啯𒁷ꍲᕤ'

const uint8Array2 = new Uint8Array(base65536.decode(string));
console.log(uint8Array2); // [104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100]
```

## API

### base65536.encode(arrayBuffer[, wrap])

Encodes an [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) and returns a Base65536 `String`, suitable for passing safely through almost any "Unicode-clean" text-handling API. This string contains no special characters and is immune to Unicode normalization. The string encodes two bytes per code point.

If `wrap` is set, a `\n` will be inserted between every `wrap` Unicode characters of output. Suggested value: 140.

### base65536.decode(string[, ignoreGarbage])

Decodes a Base65536 `String` and returns an `ArrayBuffer` containing the original binary data.

By default this function is very strict, with no tolerance for whitespace or other unexpected characters. An `Error` is thrown if the supplied string is not a valid Base65536 text, or if there is a "final byte" code point in the middle of the string. Set `ignoreGarbage` to `true` to ignore non-Base65536 characters (line breaks, spaces, alphanumerics, ...) in the input.

## Why?

Erm.

I wanted people to be able to share [HATETRIS](http://qntm.org/files/hatetris/hatetris.html) replays via Twitter.

Twitter supports tweets of up to 140 characters. "[Tweet length is measured by the number of codepoints in the NFC normalized version of the text.](https://dev.twitter.com/overview/api/counting-characters)"

HATETRIS has four buttons: left, right, down and rotate. A single move in HATETRIS therefore encodes two bits of information. At present, replays are encoded as hexadecimal and spaced for legibility/selectability. Although a game of HATETRIS may extend for an arbitrary number of keystrokes (simply press rotate forever), in general, the longer the game goes on, the higher one's score.

The world record HATETRIS replay (30 points) is 1,440 keystrokes = 2,880 bits long. At present, HATETRIS replays are encoded as hexadecimal, with each hexadecimal digit encoding 4 bits = 2 keystrokes, and spaces added for clarity/legibility, then presented as text, like so:

> C02A AAAA AAAB 00AA AAAA AC08 AAAA AAC2 AAAA AAAA C2AA AAAA AEAA AAAA AA56
> AAAA AAAA B55A AAAA AA96 AAAA AAAA D5AA AAAA A9AA AAAA AAB5 AAAA AAAA AAAA
> AAAA DAAA AAAA 9756 AAAA AA8A AAAA AAAB AAAA AAAB 5AAA AAAB 56AA AAAA AAAA
> A82A AAAA B00A AAAA A6D6 AB55 6AAA AAA9 4AAA AAA6 AAAA AD56 AAAA B56A AAAA
> 032A AAAA A65B F00A AAAA AA6E EFC0 2AAA AAAA EB00 AAAA AAA8 0AAA AAAA 802A
> AAAA AA54 AAAA AAA1 AAAA AAA0 AAAA AAA0 0AAA AAAA C02A AAAA B002 AAAA B00A
> AAAC 2AAA AAB0 AAAA AEAA AAA9 5AAA AAA9 D5AA AAA5 AAAA AAB5 6AAA A6AA AAAB
> 5AAA AAAA AAAA DAAA AAD5 56AA AA2A AAAA BAAA AAD6 AAAB 56AA AAAA 82AA AC02
> AAA7 B5AA D556 AAAA 52AA A6AA B55A AB56 AA80 FCAA AAA5 583F 0AAA A9BB BF00
> AAAA AE80 32AA AA82 FAAA A802 AAAA 96AA AA1A AAA8 2AAA A00A AAAB 00AA AB00
> AAB0 AAAB 0AAB AAA9 5AAA AD56 AA5A AAB5 6AAC 02A9 AAAB 5AAA AAAD AAB5 5AA2
> AAAE AA0A AAB2 AAD5 6AB5 AA02 AAA0 0AAA B55A AD6A BAAC 2AAB 0AA0 C2AA C02A

That's 899 characters including spaces, or 720 characters if the spaces were removed. Were the hexadecimal characters converted to binary, I would have 360 bytes, and were the binary expressed in Base64, I would have 480 characters.

Using elementary run-length encoding, with two bits of keystroke and two bits of run length, I get down to 2040 bits. That's 255 bytes, which is still 340 characters of Base64. But in Base65536 this is 128 code points! Much better.

> 𤇃𢊻𤄻嶜𤄋𤇁𡊻𤄛𤆬𠲻𤆻𠆜𢮻𤆻ꊌ𢪻𤆻邌𤆻𤊻𤅋𤲥𣾻𤄋𥆸𣊻𤅛ꊌ𤆻𤆱炼綻𤋅𤅴薹𣪻𣊻𣽻𤇆𤚢𣺻赈𤇣綹𤻈𤇣𤾺𤇃悺𢦻𤂻𤅠㢹𣾻𤄛𤆓𤦹𤊻𤄰炜傼𤞻𢊻𣲻𣺻ꉌ邹𡊻𣹫𤅋𤇅𣾻𤇄𓎜𠚻𤊻𢊻𤉛𤅫𤂑𤃃𡉌𤵛𣹛𤁐𢉋𡉻𡡫𤇠𠞗𤇡𡊄𡒌𣼻燉𣼋𦄘炸邹㢸𠞻𠦻𡊻𣈻𡈻𣈛𡈛ꊺ𠆼𤂅𣻆𣫃𤮺𤊻𡉋㽻𣺬𣈛𡈋𤭻𤂲𣈻𤭻𤊼𢈛儛𡈛ᔺ

This [fits comfortably in a Tweet](https://twitter.com/qntm/status/673523018224791552), with an extravagant 12 characters left over for your comment.

And of course, the worse you are at HATETRIS, the shorter your replay is, and the more room you have for invective.

## Unicode has 1,114,112 code points, most of which we aren't using. Can we go further?

Not yet.

To encode one additional bit per character, or 140 additional bits (37.5 additional bytes) per Tweet, we need to *double* the number of code points we use from 65,536 to 131,072. This would be a new encoding, [Base131072](https://github.com/ferno/base131072), and its UTF-32 encoding efficiency would be 53% vs. 50% for Base65536. (Note that in UTF-16, [Base32768](https://github.com/ferno/base32768) significantly outperforms either choice, and in UTF-8, Base64 remains the preferred choice.)

However, as of Unicode 8.0, [`base65536gen`](https://github.com/ferno/base65536gen) returns only 92,240 safe characters from the "Letter, Other" [General Category](https://en.wikipedia.org/wiki/Unicode_character_property#General_Category). Modifying it to add other safe General Categories (all the Letter, Number and Symbol GCs) yields only 101,064 safe characters. A similar calculation for Unicode 9.0 is forthcoming but the numbers still aren't high enough.

Perhaps future versions of Unicode will assign more characters and make this possible.

## License

MIT

## Other versions

* [`base65536-stream`](https://github.com/qntm/base65536-stream) - streaming implementation
* [`base65536-cli`](https://github.com/qntm/base65536-cli) - command-line tool

## In other languages

This is a JavaScript implementation of the Base65536 encoding. There are other implementations:

* [Python](https://github.com/Parkayun/base65536)
* [Go](https://github.com/Nightbug/go-base65536)
* [Ruby](https://github.com/Nightbug/base65536-ruby)
* [PHP](https://github.com/hevertonfreitas/base65536)
* [C](https://github.com/girst/base65536)
* [Rust](https://github.com/nuew/base65536)
* [C#](https://github.com/cyberdot/base65536)

Planning an implementation of your own? You may find [these test case files](https://github.com/qntm/base65536-test)  useful.
