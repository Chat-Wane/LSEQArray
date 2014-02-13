var bigInt = require('big-integer');

/*!
 * \class Base
 * \brief provides basic function to bit manipulation
 * \param b the number of bits at level 0 of the dense space
 */
function Base(b){
    var DEFAULT_BASE = 3;
    this._b = b || DEFAULT_BASE;
};

/*!
 * \brief Process the number of bits usage at a certain level of dense space
 * \param level the level in dense space, i.e., the number of concatenation
 */
Base.prototype.getBitBase = function(level){
    return this._b + level;
};

/*!
 * \brief Process the total number of bits usage to get to a certain level
 * \param level the level in dense space
 */
Base.prototype.getSumBit = function(level){
    var n = this.getBitBase(level);
    var m = this._b-1;
    return (n * (n + 1)) / 2 - (m * (m + 1) / 2);
};

/*!
 * \brief Process the discrete space available between p and q at a level
 * \param p the previous identifier including the position in the dense space
 * \param q the next identifier including the position in the dense space
 * \param level the targeted level in the dense space
 * \param return the number of possible digit at a certain level in dense space
 */
Base.prototype.getInterval = function(p, q, level){
    var prevBitLength = this.getSumBit(p._c.length -1);
    var nextBitLength = this.getSumBit(q._c.length -1);
    
    var bitBaseSum = this.getSumBit(level);
    
    // #1 truncate or expend
    // #1a process the previous digit
    // if (prevBitLength < bitBaseSum): Add 0
    // if (prevBitLength > bitBaseSum): truncate
    if (bitBaseSum < prevBitLength){
	var prev = p._d.divide(bigInt(2).pow(prevBitLength - bitBaseSum));
    } else {
	var prev = p._d.multiply(bigInt(2).pow(bitBaseSum - prevBitLength));
    };
    // #1b process the next digit
    if (bitBaseSum < nextBitLength){
	var next = q._d.divide(bigInt(2).pow(nextBitLength - bitBaseSum));
    } else {
	var next = q._d.multiply(bigInt(2).pow(bitBaseSum - nextBitLength));
    };
    
    // #2 process the particular case: q<p at the targeted level
    if (next.lesser(prev)) {
	// #2a: look for the common root
	var i = 0;
	var sumBitI = this.getSumBit(i);
	while ((prev.divide(bigInt(2).pow(prevBitLength - sumBitI))).equals
	       (next.divide(bigInt(2).pow(nextBitLength - sumBitI))) &&
	       (bitBaseSum - sumBitI >= 0)) {
	    ++i;
	    sumBitI = this.getSumBit(i);
	};
	// #2b: add one
	next = next.divide(bigInt(2).pow(nextBitLength-
					 this.getSumBit(i - 1))).next();
	nextBitLength = this.getSumBit(i-1);
	// #2c: append missing zeros
	next = next.multiply(bigInt(2).pow(bitBaseSum - nextBitLength));
    };
    return (next.minus(prev)).prev();
};

module.exports = Base;
