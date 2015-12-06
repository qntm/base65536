/** Tests for base65536, ensure strings survive round trips, etc. */

var base65536 = require("./index.js");
var fs = require("fs");

// Exhaustively try all single-byte buffers

var forms = ["NFC", "NFD", "NFKC", "NFKD"];

for(var b = 0; b < 256; b++) {
	var buf1 = new Buffer([b]);
	var str1 = base65536.encode(buf1);
	forms.forEach(function(form) {
		if(str1.normalize(form) !== str1) {
			throw new Error("String failed to survive normalization! " + str1);
		}
	});
	var buf2 = base65536.decode(str1);
	if(!buf1.equals(buf2)) {
		throw new Error("Bad buffer round trip! " + String(b));
	}
}

// What if there's a rogue end-of-stream char in there?
var bad = base65536.encode(new Buffer([37])) + base65536.encode(new Buffer([19]));
try {
	base65536.decode(bad);
	throw new Error("This should have failed");
} catch(e) {
	if(e.message === "This should have failed") {
		throw e;
	}
	// otherwise OK
}

// This one failed at first, exposing a defect now fixed
var firstDefectStr = base65536.encode(new Buffer([0, 110]));
console.log(firstDefectStr.codePointAt(0) === 67072);
console.log(firstDefectStr.codePointAt(0) === 0x10600);
console.log(firstDefectStr.length === 2);
console.log(firstDefectStr.charCodeAt(0) === 0xD801);
console.log(firstDefectStr.charCodeAt(1) === 0xDE00);
console.log(firstDefectStr === "\uD801\uDE00");
var firstDefectBuf = base65536.decode(firstDefectStr);
console.log(firstDefectBuf.equals(new Buffer([0, 110])));

// Exhaustively try all two-byte buffers (takes a moment or two)
for(var b1 = 0; b1 < 256; b1++) {
	for(var b2 = 0; b2 < 256; b2++) {
		var buf1 = new Buffer([b1, b2]);
		var str1 = base65536.encode(buf1);
		forms.forEach(function(form) {
			if(str1.normalize(form) !== str1) {
				throw new Error("String failed to survive normalizetion! " + str1);
			}
		});
		var buf2 = base65536.decode(str1);
		if(!buf1.equals(buf2)) {
			throw new Error("Bad buffer round trip! " + String(b1) + "," + String(b2));
		}
	}
}

// Try some real binary samples, including a few images

var sampleFiles = [
	"./sample-files/everyByte",
	"./sample-files/everyPairOfBytes",
	"./sample-files/lena_std.tif"
];

sampleFiles.forEach(function(sampleFile) {
	var buf1 = fs.readFileSync(sampleFile);
	var str1 = base65536.encode(buf1);
	forms.forEach(function(form) {
		if(str1.normalize(form) !== str1) {
			throw new Error("String failed to survive normalization! " + str1);
		}
	});
	var buf2 = base65536.decode(str1);
	if(!buf1.equals(buf2)) {
		throw new Error("Buffers differ!");
	}
});

// Gee I hope this example code works
(function() {
	var buf = new Buffer("hello world");

	var str = base65536.encode(buf);
	console.log(str === "驨ꍬ啯𒁷ꍲᕤ");

	var buf2 = base65536.decode(str);
	console.log(buf.equals(buf2));
}());

(function() {
	var str = base65536.encode(new Buffer([255, 255]));
	console.log(str === "\uD861\uDDFF");
	console.log(str.codePointAt(0) === 165375); // U+285FF
	console.log(str === "𨗿");
	console.log(str.length === 2);
	console.log(str.charCodeAt(0) === 55393);
	console.log(str.charCodeAt(1) === 56831);
}());

console.log("OK");
