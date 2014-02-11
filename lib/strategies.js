var Base = new (require('./base.js'))(3);
var ID = require('./identifier.js');

var BOUNDARY = 10;

/*!
 * \brief Choose an id starting from previous bound and adding random number
 * \param p the previous identifier
 * \param q the next identifier
 * \param level the number of concatenation composing the new identifier
 * \param interval the interval between p and q
 * \param s the source that creates the new identifier
 * \param c the counter of that source
 */
function boundaryPlus(p, q, level, interval, s, c){
    
    // #0 process the interval for random
    var step = Math.min(boundary, interval);
    
    // #1 Truncate or extends p or q
    var diffBitCount = Base.getSumBit(p._c.length()-1) - Base.getSumBit(level);

    var oldD = Math.floor(p._d / math.pow(2,diffBitCount));

    // #2 create a digit for an identifier by adding a random value
    var randomInt = Math.floor(Math.random()*step +1);
    
    // #2a Digit
    var newD = oldD + randomInt;

    // #2b Source & counter
    var id = getSC(newD, p, q, level, s, c);
    return id;
};


function boundaryMinus(p, q, level, interval, s, c){
    // #0 process the interval for random
    var step = Math.min(boundary, interval);
    
    var prevBitLength = Base.getBitSum(p._c.length - 1);
    var nextBitLength = Base.getBitSum(q._c.length - 1);
    var bitBaseSum = Base.getBitSum(level)

    // #1 Truncate or extends p and q
    var prev = Math.floor(p._d / Math.pow(2, bitBaseSum - prevBitLength));
    var next = Math.floor(q._d / Math.pow(2, bitBaseSum - nextBitLength));

    // #2 Handling particular case of next < prev
    if (next < prev){
	// #2a Look for the common root
	var i = 0;
        var sumBitI = this.getSumBit(i);
        while ((Math.floor(prev / Math.pow(2, prevBitLength - sumBitI))  ==
                Math.floor(next / Math.pow(2, nextBitLength - sumBitI))) &&
               (bitBaseSum - sumBitI >= 0)) {
            ++i;
            sumBitI = this.getSumBit(i);
        };
        // #2b: add one
        next = Math.floor(next / Math.pow(2, nextBitLength -
                                          this.getSumBit(i - 1))) + 1;
        nextBitLength = this.getSumBit(i-1);
        // #2c: append missing zeros
        next = Math.floor(next * Math.pow(2, bitBaseSum - nextBitLength));
    };
    
    var oldD = next;

    // #3 create a digit for an identifier by subing a random value
    var randomInt = Math.floor(Math.random()*step +1);
    
    // #3a Digit
    var newD = oldD - randomInt;

    // #3b Source & counter
    var id = getSC(newD, p, q, level, s, c);
    return id;
};

function getSC(d, p, q, level, s, c){
    var sources = [];
    var counters = [];

    var bitLength = Base.getSumBit(level);
    var tempD = d;

    for (var i = 0; i < level; ++i) {
	// #1 truncate the digit of the new id to get the i^th value
	var sumBit = Base.getSumBit(i);
	var mask = Math.pow(2, Base.getBitBase(i));
	var valD = Math.floor(tempD / Math.pow(2, bitLength - sumBit)) % mask;
	// (bitLength-sumBit >=0)

	// #2 truncate previous value the same way
	var valP = Math.floor(p._d / Math.pow(2, Base.getBitSum(p._c.length) -
					      sumBit)) % mask;
	if ( i < p._c.length && valD == valP) { // #2a copy p source & counter
	    sources[i] = p._s[i];
	    counters[i] = p._c[i];
	} else {
	    var valQ =
		Math.floor(q._d / Math.pow(2, Base.getBitSum(q._c.length) -
					   sumBit)) % (mask);
	    if (i < q._c.length && valR == valQ) { // #2b copy q site & counter
		sources[i] = q._s[i];
		counters[i] = q._c[i];
	    } else { // 2c copy our source & counter
		sources[i] = s;
		counters[i] = c;
	    };
	};
    };
    return new ID(d, sources, counters);
};

module.exports.bPlus = boundaryPlus;
module.exports.bMinus = boundaryMinus;
