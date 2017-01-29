/** Tests for base65536, ensure strings survive round trips, etc. */

var base65536 = require("./../index.js");
var fs = require("fs");
var glob = require("glob");

var forms = ["NFC", "NFD", "NFKC", "NFKD"];

glob("./test/pairs/**/*.bin", function(err, files) {
	if(err) {
		throw Error(err);
	}
	files.forEach(function(fileName) {
		var caseName = fileName.substring(0, fileName.length - ".bin".length);
		console.log(caseName);
		var binary = fs.readFileSync(caseName + ".bin");
		var text = fs.readFileSync(caseName + ".txt", "utf8");
		if(base65536.encode(binary) !== text) {
			console.error("Input binary", binary);
			console.error("Expected text", text);
			console.error("Actual text", base65536.encode(binary));
			throw Error("Encode error");
		}
		if(!base65536.decode(text).equals(binary)) {
			console.error("Input text", text);
			console.error("Expected binary", binary);
			console.error("Actual binary", base65536.decode(text));
			throw Error("Decode error");
		}
		forms.forEach(function(form) {
			if(text.normalize(form) !== text) {
				throw new Error("String failed to survive " + form + " normalization! " + text);
			}
		});
	});

	glob("./test/bad/**/*.txt", function(err, files) {
		if(err) {
			throw Error(err);
		}
		files.forEach(function(fileName) {
			var caseName = fileName.substring(0, fileName.length - ".txt".length);
			console.log(caseName);
			var text = fs.readFileSync(caseName + ".txt", "utf8");
			var threw;
			try {
				base65536.decode(text);
				threw = false;
			} catch(e) {
				threw = true;
			}
			if(!threw) {
				throw new Error("String should have failed to decode!" + text);
			}
		});
	});
});

// TODO: use an actual JS assertion library or something
