var assert = require('assert');
var expect = require('chai').expect;
require('mocha-sinon');

describe('html-diff', function() {  
    beforeEach(function() {
      this.sinon.stub(console, 'log');
    });

    var htmldiff = require( "../html-diff" );
});
