var expect = require('expect.js');
var BI = require('BigInt');
var Mocha  = require('mocha');


var ID = require('../lib/identifier.js');
var Base = new (require('../lib/base.js'))(3);

// using a departure base value of 3 bits
describe('positions.js', function() {
    
    describe('positions', function(){
	it('is initialized correctly', function(){
	    var i1 = new ID(BI.int2bigInt(0,1),[0],[0]);
	    expect(BI.isZero(i1._d)).to.be.ok();
	    expect(i1._s).to.have.length(1);
	    expect(i1._c).to.have.length(1);
	});
    });
    
    describe('compare', function(){
	it('compare digit first of lvl 0', function(){
	    var i1 = new ID(BI.int2bigInt(3,2),[0],[0]); // d:[3]
	    var i2 = new ID(BI.int2bigInt(5,3),[0],[0]); // d:[5]
	    expect(i1.compare(i2)).to.be.below(0);
	    expect(i2.compare(i1)).to.be.above(0);
	});

	it('compare digit first of lvl 1', function(){
	    var i1 = new ID(BI.int2bigInt(19,Base.getSumBit(1)),
			    [0,1],[0,1]); // d:[1,3]
	    var i2 = new ID(BI.int2bigInt(37,Base.getSumBit(1)),
			    [0,1],[0,1]); // d:[2,5]
	    expect(i1.compare(i2)).to.be.below(0);
	    expect(i2.compare(i1)).to.be.above(0);
	});

	it('compare digit first of lvl 1 but first eql', function(){
	    var i1 = new ID(BI.int2bigInt(19,Base.getSumBit(1)),
			    [0,1],[0,1]); // d:[1,3]
	    var i2 = new ID(BI.int2bigInt(21,Base.getSumBit(1)),
			    [0,1],[0,1]); // d:[1,5]
	    expect(i1.compare(i2)).to.be.below(0);
	    expect(i2.compare(i1)).to.be.above(0);
	});

	it('compare lvl 1 with source different', function(){
	    var i1 = new ID(BI.int2bigInt(19,Base.getSumBit(1)),
			    [0,3],[0,2]); // d:[1.3]
	    var i2 = new ID(BI.int2bigInt(21,Base.getSumBit(1)),
			    [3,3],[0,2]); // d:[1.5]
	    expect(i1.compare(i2)).to.be.below(0);
	    expect(i2.compare(i1)).to.be.above(0);
	});

	it('compare lvl 1 with clock different', function(){
	    var i1 = new ID(BI.int2bigInt(19,Base.getSumBit(1)),
			    [3,3],[0,1]); // d:[1.3]
	    var i2 = new ID(BI.int2bigInt(21,Base.getSumBit(1)),
			    [3,3],[0,2]); // d:[1.5]
	    expect(i1.compare(i2)).to.be.below(0);
	    expect(i2.compare(i1)).to.be.above(0);
	});

	it('compare lvl 0 with lvl 1; same d,s,c; size matters', function(){
	    var i1 = new ID(BI.int2bigInt(1,Base.getSumBit(0)),
			    [3],[0]); // d:[1]
	    var i2 = new ID(BI.int2bigInt(21,Base.getSumBit(1)),
			    [3,3],[0,2]); // d:[1.5]
	    expect(i1.compare(i2)).to.be.below(0);
	    expect(i2.compare(i1)).to.be.above(0);
	});

	it('compare lvl 1 equal identifiers', function(){
	    var i1 = new ID(BI.int2bigInt(21,Base.getSumBit(1)),
			    [3,3],[0,2]); // d:[1.5]
	    var i2 = new ID(BI.int2bigInt(21,Base.getSumBit(1)),
			    [3,3],[0,2]); // d:[1.5]
	    expect(i1.compare(i2)).to.be.eql(0);
	    expect(i2.compare(i1)).to.be.eql(0);
	});

    });
    
});
