var Base = require('base')(5);

/*!
 * \class Positions
 * \brief Unique and immutable identifier composed of digit, sources, counters
 * \param d the digit (position in dense space)
 * \param s the list of sources
 * \param c the list of counters
 */
function Positions(d, s, c){
    this._d = d;
    this._s = s;
    this._c = c;
};

Positions.prototype.compare = function(o){
    var dBitLength = Base.getSumBit(this._c.length);
    var odBitLength = Base.getSumBit(o._c.length);
    var comparing = true;

    var comp = 0;
    var i = 0;
    // #1 Compare the list of <d,s,c>
    while (comparing && i < Math.min(this._c.length, o._c.length) ) {
	// can stop before the end of for loop wiz return
	var sum = Base.getSumBit(i);
	// #1a truncate mine
	var mine = this._d / Math.pow(2, dBitLength - sum);
	// #1b truncate other
	var other = o._d / Math.pow(2, odBitLength - sum);
	// #2 Compare triples
	var comp = mine - other; // #2a digit
	if (comp != 0) {
	    comparing = false;
	} else {
	    comp = this._s[i] - o._s[i]; // #2b source
	    if (comp != 0) {
		comparing = false;
	    } else {
		comp = this._c[i] - o._c[i]; // 2c clock
		if (comp != 0) {
		    comparing = false;
		};
	    };
	};
	++i;
    };
    
    if (comp==0){
	comp = this._c.length - o._c.length; // #3 compare list size
    };
    return comp;

};
