var expect = require('expect.js');
var Mocha  = require('mocha');
var bigInt = require('big-integer');

var S = new (require('../lib/strategy.js'))(10);
var ID = require('../lib/identifier.js');
var Base = new (require('../lib/base.js'))(3);


// test passes with base of 3 in conf
describe('strategies.js', function() {
    
    describe('boundaryPlus', function(){
	it('one identifier possible', function(){
	    var p = new ID(bigInt(19),[0,1],[0,1]); // [1,3]
	    var q = new ID(bigInt(21),[0,1],[0,1]); // [1,5]
	    var interval = Base.getInterval(p,q,1);
	    expect(interval.equals(bigInt.one)).to.be.ok();
	    var id = S.bPlus(p, q, 1, interval, 42, 1337);
	    expect(id._d.equals(bigInt(20))).to.be.ok(); // [1,4]
	    expect(id._c).to.have.length(2);
	    expect(id._c[0]).to.be.eql(0); // copy counter of p at 0
	    expect(id._c[1]).to.be.eql(1337); // my counter
	    expect(id._s[0]).to.be.eql(0); // copy source of q at 0
	    expect(id._s[1]).to.be.eql(42); //my source
	});

	it('order preservations', function(){
	    var p = new ID(bigInt(512+64+8), [0,0,0], [20,21,22]); // [1,2,8]
	    var q = new ID(bigInt(16+5), [1,3] ,[4,7]); // [1,5]
	    var interval = Base.getInterval(p,q,1);
	    var id = S.bPlus(p, q, 1, interval, 42, 1337);
	    
	    expect(p.compare(q)).to.be.below(bigInt.zero); // p < q
	    expect(id.compare(p)).to.be.above(bigInt.zero); // p < id
	    expect(id.compare(q)).to.be.below(bigInt.zero); // id < q
	    expect(id._c).to.have.length(2);
	    expect(id._s[0]).to.be.eql(0); // cpy p._s at 0
	    expect(id._c[0]).to.be.eql(20); // cpy p._c at 0
	    expect(id._s[1]).to.be.eql(42);
	    expect(id._c[1]).to.be.eql(1337);
	    expect(id._d).to.be.within(bigInt(19),bigInt(20));
	    // either 19 [1,3] or 20 [1,4] 
	});
    });
    

    // Tests are the same for boundary plus and boundary minus
    describe('boundaryMinus', function(){
	it('one identifier possible', function(){
	    var p = new ID(bigInt(19),[0,1],[0,1]); // [1,3]
	    var q = new ID(bigInt(21),[0,1],[0,1]); // [1,5]
	    var interval = Base.getInterval(p,q,1);
	    expect(interval.equals(bigInt.one)).to.be.ok();
	    var id = S.bPlus(p, q, 1, interval, 42, 1337);
	    expect(id._d.equals(bigInt(20))).to.be.ok(); // [1,4]
	    expect(id._c).to.have.length(2);
	    expect(id._c[0]).to.be.eql(0); // copy counter of p at 0
	    expect(id._c[1]).to.be.eql(1337); // my counter
	    expect(id._s[0]).to.be.eql(0); // copy source of q at 0
	    expect(id._s[1]).to.be.eql(42); //my source
	});
	
        it('order preservations', function(){
            var p = new ID(bigInt(512+64+8), [0,0,0], [20,21,22]); // [1,2,8]
            var q = new ID(bigInt(16+5) ,[1,3] ,[4,7]); // [1,5]
            var interval = Base.getInterval(p,q,1); 
            var id = S.bMinus(p, q, 1, interval, 42, 1337);
	    
            expect(p.compare(q)).to.be.below(bigInt.zero); // p < q
            expect(id.compare(p)).to.be.above(bigInt.zero); // p < id
            expect(id.compare(q)).to.be.below(bigInt.zero); // id < q
            expect(id._c).to.have.length(2);
            expect(id._s[0]).to.be.eql(0); // cpy p._s at 0
            expect(id._c[0]).to.be.eql(20); // cpy p._c at 0
            expect(id._s[1]).to.be.eql(42);
            expect(id._c[1]).to.be.eql(1337);
            expect(id._d).to.be.within(bigInt(19),bigInt(20));
	    // either 19 [1,3] or 20 [1,4]
        });

    });

});
