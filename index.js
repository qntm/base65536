/**
	Routines for converting binary data into text data which can be sent safely
	through "Unicode-clean" text systems without information being lost. Analogous
	to Base64 with a significantly larger character repertoire enabling the
	encoding of two bytes per character (for comparison, Base64 manages 3/4 of a
	byte per character).
*/

'use strict';

// Some constants for UTF-16 encoding/decoding

// High surrogate. Lowest 10 bits are free
var high = 0xD800;

// Low surrogate. Lowest 10 bits are free. So a
// high surrogate and a low surrogate between them
// can encode 20 bits.
var low = 0xDC00;

// Code points outside of the BMP are from 65536 to
// 1114111, so we subtract this figure to make them
// from 0 to 1048575, 20 bits.
var bmpThreshold = 1 << 16;

// First 10 bits go in the low surrogate, the rest 
var offset = 1 << 10;

// Because the spread operator isn't universal. :-/
// Return code points directly instead of individual characters
// to save some steps
var spreadString = function(str) {
	var codePoints = [];
	var i = 0;
	while(i < str.length) {
		var first = str.charCodeAt(i);
		i++;
		if (high <= first && first < high + offset) {
			// UTF-16 decode
			var second = str.charCodeAt(i);
			i++;
			if (low <= second && second < low + offset) {
				codePoints.push((first - high) * offset + (second - low) + bmpThreshold);
			} else {
				throw Error("Invalid UTF-16");
			}
		} else {
			codePoints.push(first);
		}
	}
	return codePoints;
};

var paddingBlockStart = spreadString("ᔀ")[0];
var blockStarts = spreadString(
	"㐀㔀㘀㜀㠀㤀㨀㬀㰀㴀㸀㼀䀀䄀䈀䌀" +
	"䐀䔀䘀䜀䠀䤀䨀䬀䰀一伀倀儀刀匀吀" +
	"唀嘀圀堀夀娀嬀尀崀帀开怀愀戀挀搀" +
	"攀昀最栀椀樀欀氀洀渀漀瀀焀爀猀琀" +
	"甀瘀眀砀礀稀笀簀紀縀缀耀脀舀茀萀" +
	"蔀蘀蜀蠀褀言謀谀贀踀輀退鄀鈀錀鐀" +
	"销阀需頀餀騀鬀鰀鴀鸀ꄀꈀꌀꔀ𐘀𒀀" +
	"𒄀𒈀𓀀𓄀𓈀𓌀𔐀𔔀𖠀𖤀𠀀𠄀𠈀𠌀𠐀𠔀" +
	"𠘀𠜀𠠀𠤀𠨀𠬀𠰀𠴀𠸀𠼀𡀀𡄀𡈀𡌀𡐀𡔀" +
	"𡘀𡜀𡠀𡤀𡨀𡬀𡰀𡴀𡸀𡼀𢀀𢄀𢈀𢌀𢐀𢔀" +
	"𢘀𢜀𢠀𢤀𢨀𢬀𢰀𢴀𢸀𢼀𣀀𣄀𣈀𣌀𣐀𣔀" +
	"𣘀𣜀𣠀𣤀𣨀𣬀𣰀𣴀𣸀𣼀𤀀𤄀𤈀𤌀𤐀𤔀" +
	"𤘀𤜀𤠀𤤀𤨀𤬀𤰀𤴀𤸀𤼀𥀀𥄀𥈀𥌀𥐀𥔀" +
	"𥘀𥜀𥠀𥤀𥨀𥬀𥰀𥴀𥸀𥼀𦀀𦄀𦈀𦌀𦐀𦔀" +
	"𦘀𦜀𦠀𦤀𦨀𦬀𦰀𦴀𦸀𦼀𧀀𧄀𧈀𧌀𧐀𧔀" +
	"𧘀𧜀𧠀𧤀𧨀𧬀𧰀𧴀𧸀𧼀𨀀𨄀𨈀𨌀𨐀𨔀"
);

var possibleBytes = 1 << 8;

var b2s = {};
for(var b = 0; b < possibleBytes; b++) {
	b2s[blockStarts[b]] = b;
}

module.exports = {

	encode: function(buf) {
		var codePoints = [];
		for(var i = 0; i < buf.length; i += 2) {
			var b1 = buf[i];
			var blockStart = i + 1 < buf.length ? blockStarts[buf[i + 1]] : paddingBlockStart;
			var codePoint = blockStart + b1;
			codePoints.push(codePoint);
		}
		return codePoints.map(function(codePoint) {
			if(codePoint < bmpThreshold) {
				var first = codePoint;
				return String.fromCharCode(first);
			}

			// UTF-16 encode
			var first = high + ((codePoint - bmpThreshold) / offset);
			var second = low + (codePoint % offset);
			return String.fromCharCode(first) + String.fromCharCode(second);
		}).join("");
	},

	decode: function(str) {
		var bytes = [];
		var done = false;
		spreadString(str).forEach(function(codePoint) {
			if(done) {
				throw Error("Base65536 sequence continued after final byte");
			}
			var b1 = codePoint & ((possibleBytes) - 1);
			var blockStart = codePoint - b1;
			if(blockStart === paddingBlockStart) {
				bytes.push(b1);
				done = true;
			} else {
				var b2 = b2s[blockStart];
				if(b2 === undefined) {
					throw Error("Not a valid Base65536 code point: " + String(codePoint));
				}
				bytes.push(b1, b2);
			}
		});
		return Buffer.from(bytes)
	}
};
