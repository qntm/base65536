# base65536

Base65536 is a binary encoding optimised for UTF-32-encoded text. (For transmitting data through Twitter, Base65536 is now considered obsolete; see [Base2048](https://github.com/qntm/base2048).) This JavaScript module, `base65536`, is the first implementation of this encoding.

Base65536 uses only ["safe" Unicode code points](https://qntm.org/safe) - no unassigned code points, no whitespace, no control characters, *etc.*.

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
      <td>Unary / <a href="https://github.com/qntm/base1">Base1</a></td>
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
      <td><a href="https://github.com/qntm/hexagram-encode">HexagramEncode</a></td>
      <td style="text-align: right;">25%</td>
      <td style="text-align: right;">38%</td>
      <td style="text-align: right;">19%</td>
      <td style="text-align: right;">105</td>
    </tr>
    <tr>
      <td><a href="https://github.com/qntm/braille-encode">BrailleEncode</a></td>
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
      <td><a href="https://github.com/qntm/base32768">Base32768</a></td>
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
      <td><a href="https://github.com/qntm/base65536">Base65536</a></td>
      <td style="text-align: right;">56%</td>
      <td style="text-align: right;">64%</td>
      <td style="text-align: right;"><strong>50%</strong></td>
      <td style="text-align: right;">280</td>
    </tr>
    <tr>
      <td><a href="https://github.com/qntm/base131072">Base131072</a> ‡</td>
      <td style="text-align: right;">53%+</td>
      <td style="text-align: right;">53%+</td>
      <td style="text-align: right;">53%</td>
      <td style="text-align: right;">297</td>
    </tr>
  </tbody>
</table>

\* Up to 280 Unicode characters give or take Twitter's complex "weighting" calculation.<br/>
† Base85 is listed for completeness but all variants use characters which are considered hazardous for general use in text: escape characters, brackets, punctuation *etc.*.<br/>
‡ Base131072 is a work in progress, not yet ready for general use.<br/>

## Installation

```bash
$ npm install base65536
```

## Usage

```js
import { encode, decode } from 'base65536'

const uint8Array = new Uint8Array([104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100])

const string = encode(uint8Array.buffer)
console.log(string);
// 6 code points, '驨ꍬ啯𒁷ꍲᕤ'

const uint8Array2 = new Uint8Array( decode(string))
console.log(uint8Array2);
// [104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100]
```

### In the browser

Load this file in the browser to gain access to a `base65536` global.

```html
<script src='https://unpkg.com/base65536@3/dist/iife/base65536.js' crossorigin></script>
<script>
  console.log(base65536.decode('驨ꍬ啯𒁷ꍲᕤ'))
</script>
```

## API

`base65536` accepts and returns `Uint8Array`s. Note that every Node.js `Buffer` is a `Uint8Array`. A `Uint8Array` can be converted to a Node.js `Buffer` like so:

```js
const buffer = Buffer.from(uint8Array.buffer, uint8Array.byteOffset, uint8Array.byteLength)
```

### encode(uint8Array)

Encodes a [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) and returns a Base65536 `String`, suitable for passing safely through almost any "Unicode-clean" text-handling API. This string contains no special characters and is immune to Unicode normalization. The string encodes two bytes per code point.

### decode(string)

Decodes a Base65536 `String` and returns a `Uint8Array` containing the original binary data.

## Background

### Why?

Erm.

I wanted people to be able to share [HATETRIS](http://qntm.org/files/hatetris/hatetris.html) replays via Twitter.

HATETRIS has four buttons: left, right, down and rotate. A single move in HATETRIS therefore encodes two bits of information. Although a game of HATETRIS may extend for an arbitrary number of keystrokes (simply press rotate forever), in general, the longer the game goes on, the higher one's score. In late 2015, when Base65536 was first developed, the world record HATETRIS replay (30 points) was 1,440 keystrokes = 2,880 bits long, and HATETRIS replays were encoded as hexadecimal, with each hexadecimal digit encoding 4 bits = 2 keystrokes, and spaces added for clarity/legibility, then presented as text, like so:

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

That's 899 characters including spaces, or 720 characters if the spaces were removed. Were the hexadecimal characters converted to binary, one would have 360 bytes, and were the binary expressed in Base64, one would have 480 characters. This made replays impractical to share via Twitter, which at the time supported Tweets of only at most 140 characters.

Using elementary run-length encoding, using two bits of keystroke and two bits of run length, the replay shrinks to 2040 bits *i.e.* 255 bytes *i.e.* 340 characters of Base64. But that's still much too large.

However, interestingly, "[Tweet length is measured by the number of codepoints in the NFC normalized version of the text.](https://dev.twitter.com/overview/api/counting-characters)", *not* by counting the number of bytes in any specific encoding of the text. Realising this, I developed Base65536. Whereas Base64 encodes only 6 bits per Unicode code point for a potential maximum of 105 bytes per Tweet, Base65536 encodes 16 bits per Unicode code point for a vastly improved **280 bytes per Tweet**.

Expressing the 255-byte run-length encoded replay as Base65536, we get a string which is a svelte 128 code points long:

> 𤇃𢊻𤄻嶜𤄋𤇁𡊻𤄛𤆬𠲻𤆻𠆜𢮻𤆻ꊌ𢪻𤆻邌𤆻𤊻𤅋𤲥𣾻𤄋𥆸𣊻𤅛ꊌ𤆻𤆱炼綻𤋅𤅴薹𣪻𣊻𣽻𤇆𤚢𣺻赈𤇣綹𤻈𤇣𤾺𤇃悺𢦻𤂻𤅠㢹𣾻𤄛𤆓𤦹𤊻𤄰炜傼𤞻𢊻𣲻𣺻ꉌ邹𡊻𣹫𤅋𤇅𣾻𤇄𓎜𠚻𤊻𢊻𤉛𤅫𤂑𤃃𡉌𤵛𣹛𤁐𢉋𡉻𡡫𤇠𠞗𤇡𡊄𡒌𣼻燉𣼋𦄘炸邹㢸𠞻𠦻𡊻𣈻𡈻𣈛𡈛ꊺ𠆼𤂅𣻆𣫃𤮺𤊻𡉋㽻𣺬𣈛𡈋𤭻𤂲𣈻𤭻𤊼𢈛儛𡈛ᔺ

This [fit comfortably in a Tweet](https://twitter.com/qntm/status/673523018224791552), with an extravagant 12 characters left over for commentary. Of course, worse HATETRIS players typically end up with shorter replays, leaving more room for invective.

## Later developments

The 30-point record above was set on 4 May 2010. On 6 June 2017 the record was broken with a 31-point run whose Base65536 replay:

> 𤂻愈䲻㰋𣻋㼘𤇀𠞻𤇋傜𣾻𤇋𤆦𠪵𤃄遈肼𡮻𤆻絈𤇄𤆴𥆹𤅛𤆻𤺸𤅋𤄋𥆺𠞻𤆻𥆐𠪻𠪄𤇄𣺁𤄋𡪄郈𢪻𤇄㲸㰈𤄋𤊁𤂻𤄜𡪼𣢻𡊀𣺻丘𤇋𤩘𣾻𥄈𠪻𤃋㰈𤀛蹌𤅋𤄋𡚡𤇋𤀜緊𣥋𤆜𤆁𠲼綹𥅘𣹋䰉𣼋蹊𤽋𤅋𤆌𤆰𡚡䲻𤇂𤆤𡪥𣚻𣢻𠮤𤺸𤅋𤂄𡘜羹𤇆㾸㶹𤀌𢙛𡞐𤆌㶺𥄩𡮴㺻𣣋𤃋𣛋𥆀𤺦ꉊ𣛄𠚀𠚜𤆀职𢊻徻蹈𢫄𣾻𤄌𤛋𡛁𡫋羌𡏋㼈𢢌𢢬𥂐𡫅𣪄𡊤肻𣊐㼸𢪠𢪄䂸𡪄趜𥀩𡙋𢢀𡊀𣺆㼩𤂄𡫇𡪴䲹𥄉𨂀

was 154 code points long, too long to fit in a Tweet.

Later in 2017, Twitter <a href="https://blog.twitter.com/official/en_us/topics/product/2017/Giving-you-more-characters-to-express-yourself.html">increased the maximum Tweet length</a> from 140 to 280 Unicode code points... except that code points U+1100 HANGUL CHOSEONG KIYEOK upwards now counted double. This effectively divided Unicode into "light" code points and "heavy" code points. Since Base65536 exclusively uses heavy code points, a new "long" Tweet could still only contain at most 140 code points of Base65536, or 280 bytes.

These two events spurred me to develop a new binary encoding optimised for the new long Tweets, [Base2048](https://github.com/qntm/base2048). Using Base2048, up to 385 bytes can fit in a Tweet. The previously unTweetable record 31-point replay becomes:

> ௨ഖƌݯߜࠏІWƑsໃa௨೯ܘݷಳජଈیԪؼʥݺԥඞܘݲࠐڄໂঅமةໃݹ௧ړІٽ௨൞ໃZ௨ಘІܥࠐΣІZߜටȜখذජНݹߛeʛݹߤปເѧ௩ԚໂՉࢸටuа௨સȣݷłقෆঅਏeܘԔצقషݸɢڠຜঀಧҸມѧஐට༪൩ԊಅഫܡथsถԡԦԚໃɥஸقࡈɕɠɈไݸצقషݰਵϺФঅஓػݐɓԞуຯɕझࡈ๐ݞझࢶІݞमปദஈƉؿଭݪஸҩЂ൸ԛمϦGƁҨVھԥචЅշࡂ෮लݷƘණ໘ࠅƘಧНקࢻҨฆӘದԋϝପࠑ੧ͳݲடփරݞਵΚϼɢԒԺٳѦԤࠌξGಘسਯܥஶҋϮτथlϼʔ

which, yes, [fits just fine](https://twitter.com/qntm/status/931634672236449793).

Base2048 sadly renders Base65536 obsolete for its original intended purpose of sending binary data through Twitter. Base2048 is now used instead of Base65536 for rendering HATETRIS replays.

However, Base65536 remains the state of the art for sending binary data through text-based systems which naively counts Unicode code points, particularly those using the fixed-width UTF-32 encoding.

## Unicode has 1,114,112 code points, most of which we aren't using. Can we go further?

Not yet.

To encode one additional bit per code point, we need to *double* the number of code points we use from 65,536 to 131,072. This would be a new encoding, [Base131072](https://github.com/qntm/base131072), and its UTF-32 encoding efficiency would be 53% vs. 50% for Base65536. (Note that in UTF-16, [Base32768](https://github.com/qntm/base32768) significantly outperforms either choice, and in UTF-8, Base64 remains the preferred choice.)

However, as of Unicode 10.0, [`base65536gen`](https://github.com/qntm/base65536gen) returns only 116,813 safe code points altogether. Perhaps future versions of Unicode will eventually assign more characters and make this possible, but even when this eventually happens, it seems unlikely that the characters will be arranged neatly in the blocks of 256 which make Base65536 so small and simple. It might not be worth the trouble...

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
* [C](https://git.gir.st/base65536.git)
* [Rust](https://github.com/nuew/base65536)
* [C#](https://github.com/cyberdot/base65536)

Planning an implementation of your own? You may find [these test case files](https://github.com/qntm/base65536-test)  useful.
