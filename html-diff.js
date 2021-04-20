#!/usr/bin/env node

var fs = require( "fs" );
var diff = require( "./diff" );

diff( process.argv.slice( 2 ).join( " " ), function( error, parsedDiff ) {
	if ( error ) {

		// Usage error, assume we're not in a git directory
		if ( error.code === 129 ) {
			process.stderr.write( "Error: Not a git repository\n" );
			return;
		}

		process.stderr.write( error.message );
		return;
	}

	if ( !parsedDiff ) {
		console.log( "No differences" );
		return;
	}

	generateHtmlDiff( parsedDiff );
});

function generateHtmlDiff( parsedDiff ) {
	var template = fs.readFileSync( __dirname + "/template.html", "utf8" );
	var diffHtml = "";

	for ( var file in parsedDiff ) {
		diffHtml +=
			"<h2>" +
				file +
				"<button class='copy' onclick=" +
					"'navigator.clipboard.writeText(\"" + file + "\")'" +
				">copy path</button>" +
			"</h2>" +
			"<div class='file-diff'><div>" +
				markUpDiff( parsedDiff[ file ] ) +
			"</div></div>";
	}

	
	var output = template.replace( "{{diff}}", diffHtml );
	console.log(output)
}

var markUpDiff = function() {
	var diffClasses = {
		"d": "file",
		"i": "file",
		"@": "info",
		"-": "delete",
		"+": "insert",
		" ": "context"
	};

	function escape( str ) {
		return str
			.replace( /\$/g, "$$$$" )
			.replace( /&/g, "&amp;" )
			.replace( /</g, "&lt;" )
			.replace( />/g, "&gt;" )
			.replace( /\t/g, "    " );
	}

	return function( diff ) {
		return diff.map(function( line ) {
			var type = line.charAt( 0 );
			return "<pre class='" + diffClasses[ type ] + "'>" + escape( line ) + "</pre>";
		}).join( "\n" );
	};
}();
