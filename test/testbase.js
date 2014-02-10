var expect = require('expect.js');
var Mocha  = require('mocha');

var Base = require('../lib/base.js');

describe('base.js', function() {
    
    describe('base', function(){
	it('trivial test of setup', function(){
	    var base = new Base(1337);
	    expect(base._b).to.be.eql(1337);
	});
    });
    
    describe('getBitBase', function(){
	it('trivially return the bit size of certain level', function(){
	    var base = new Base(42);
	    expect(base.getBitBase(5)).to.be.eql(47);
	});
    });

    describe('getSumBit', function(){
	it('should return number of bits from lvl-0 to lvl-X', function(){
	    var base = new Base(5);
	    expect(base.getSumBit(0)).to.be.eql(base._b); // 5
	    expect(base.getSumBit(1)).to.be.eql(base._b*2+1) // 11
	    expect(base.getSumBit(2)).to.be.eql(base._b*3+3) // 18
	});
    });
});
