/**
	Routines for converting binary data into text data which can be sent safely
	through "Unicode-clean" text systems without information being lost. Analogous
	to Base64 with a significantly larger character repertoire enabling the
	encoding of two bytes per character (for comparison, Base64 manages 3/4 of a
	byte per character).
*/

require("string.fromcodepoint");
require("string.prototype.codepointat");
var get_block_start = require("./get-block-start.json");
var get_b2 = require("./get-b2.json");

var NO_BYTE = -1;

module.exports = {

    /**
     * encode from buffer to base65536 string
     * @param buf -- input buffer
     * @param offset (optional) starting byte to read from
     * @param limit (optional) total number of bytes to process
     *
     * If offset is omitted, 0 is used.
     * If limit is omitted, it will read till last byte in buffer.
     **/
	encode: function(buf, offset, limit) {
		var strs = [];
        if(offset === undefined) {
            offset = 0;
        }
        if(limit === undefined) {
            limit = buf.length - offset;
        }
        limit = limit + offset;
		for(var i = offset; i < limit; i += 2) {
			var b1 = buf[i];
			var b2 = i + 1 < limit ? buf[i + 1] : NO_BYTE;
			var codePoint = get_block_start[b2] + b1;
			var str = String.fromCodePoint(codePoint);
			strs.push(str);
		}
		return strs.join("");
	},

	decode: function(str) {
		var bufs = [];
		var done = false;
		for(var i = 0; i < str.length; i++) {
			if(done) {
				throw new Error("Base65536 sequence continued after final byte");
			}
			var codePoint = str.codePointAt(i);
			var b1 = codePoint & ((1 << 8) - 1);
			var b2 = get_b2[codePoint - b1];
			if(b2 === undefined) {
				throw new Error("Not a valid Base65536 code point: " + String(codePoint));
			}
			if(b2 === NO_BYTE) {
				bufs.push(new Buffer([b1]));
				done = true;
			} else {
				bufs.push(new Buffer([b1, b2]));
			}
			if(codePoint >= (1 << 16)) {
				i++;
			}
		}
		return Buffer.concat(bufs);
	}
};
