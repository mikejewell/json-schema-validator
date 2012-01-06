var request = require('request');
var fs = require('fs');
var validate = require('json-schema').validate;

function bail(error) {
	console.log(error);
	process.exit(1);
}

function loadURL(path, callback) {
    request(path, function(error, response, body) {
		if(!error && response.statusCode == 200) {
			var json = JSON.parse(body);
			callback(json);
		}
		else {
			bail("Error: "+response.statusCode);
		}
    });
}

function loadFile(path, callback) {
	fs.readFile(path, 'utf-8', function(error, body) {
		if(!error) {
			var json = JSON.parse(body);
			callback(json);
		}
		else {
			bail(error);
		}
	});
}

function loadJSON(path) {
	var data = fs.readFileSync(path, 'utf-8');
	var json = JSON.parse(data);
	return json;
}

function showUsage() {
	console.log("Usage: node proval.js <-url|-file> <url|filename>");
	process.exit(1);
}

function doValidation(json, schema) {
	var results = validate(json, schema);
	console.log(results);
}

function handleJSON(schema) {
	if(type === '-url') {
		loadURL(path, function(json) {
			doValidation(json, schema);
		});
	}
	else if(type === '-file') {
		loadFile(path, function(json) {
			doValidation(json, schema);
		});
	}
}

/* Bulk of code begins here */

if(process.argv.length !== 4) {
	showUsage();
}

var type = process.argv[2];

if(type !== '-url' && type !== '-file') {
	showUsage();
}

var path = process.argv[3];

loadURL('https://raw.github.com/trungdong/w3-prov/master/specs/json/prov-json-schema.js', function(schema) {
	handleJSON(schema);
});
