/*!
 * \class Base
 * \brief provides basic function to bit manipulation
 * \param b the number of bits at level 0 of the dense space
 */
function Base(b){
    this._b = b;
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
    var prev = Math.floor(p._d * Math.pow(2, bitBaseSum - prevBitLength));
    // #1b process the next digit
    var next = Math.floor(q._d * Math.pow(2, bitBaseSum - nextBitLength));
    
    // #2 process the particular case: q<p at the targeted level
    if (next - prev < 0) {
	// #2a: look for the common root
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
    }
    return next - prev - 1;
};


module.exports = Base;
