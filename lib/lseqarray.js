var BI = require('BigInt');
var conf = require('./conf.js');
var C = require('./couple.js');
var ID = require('./identifier.js');
var Base = new (require('./base.js'))(conf._base);;
var S = new (require('./strategy.js'))(conf._boundary);

/*!
 * \class LSEQArray
 *
 * \brief Distributed array using LSEQ allocation strategy
 */
function LSEQArray(s){
    this._s = s;
    this._c = 0;
//    this._hash = function(depth) { return depth%2; };
    this._hash = function(depth) { return 0; };

    this._array = []; // array of couples {_e: element, _i: identifier}
    this._array[0] = new C(null, new ID(BI.int2bigInt(0,Base.getSumBit(0)),
					[0], [0])); // lowest id
    this._array[1] = new C(null, new ID(BI.int2bigInt(Math.pow(2,Base._b+1)-1,
						      Base.getSumBit(0)),
					[Number.MAX_VALUE],
					[Number.MAX_VALUE])); // highest id
    this.length = 0;
};

/*!
 * \brief return the identifier and element at the targeted index
 * \param index the index of the couple in the array
 * \return a couple {_e: element, _i: identifier}
 */
LSEQArray.prototype.get = function(index){
    return this._array[index];
};

/*!
 * \brief insert a value at the targeted index
 * \param element the element to insert
 * \param index the position in the array
 * \return a couple {_e: element , _i: identifier}
 */
LSEQArray.prototype.insert = function(element, index){
    // #1 getting the bounds
    var pei = this.get(index);
    var qei = this.get(index+1);
    // #2 generating the identifier between the bound
    var id = this.alloc(pei._i, qei._i);
    this._c += 1;
    // #3 add it to the structure and return value
    var couple = {_e: element, _i: id}
    this.applyInsert(element, id);
    return couple;
};

/*!
 * \brief delete the element at the index
 * \param index the index of the element to delete in the array
 * \return the identifier of the element at the index
 */
LSEQArray.prototype.remove = function(index){
    var id = this.get(index+1)._i;
    this.applyRemove(id);
    return id;
};

/*!
 * \brief generate the digit part of the identifiers  between p and q
 * \param p the digit part of the previous identifier
 * \param q the digit part of the next identifier
 * \return the digit part located between p and q
 */
LSEQArray.prototype.alloc = function (p,q){
    // #1 process the level of the new identifier
    var interval = BI.int2bigInt(0,Base.getBitBase(0));
    var level = 0;
    while ( BI.isZero(interval) || BI.negative(interval) ){
	// no room for insertions
	interval = Base.getInterval(p, q, level);
	++level;
    };
    level -=1;
    var id = null;
    if (this._hash(level) == 0){
	id = S.bPlus(p,q,level,interval, this._s, this._c);
    } else {
	id = S.bMinus(p,q,level,interval, this._s, this._c);
    };
    return id;
};

/*!
 * \brief insert an element created from a remote site into the array
 * \param e the element to insert
 * \param i the identifier of the element
 */
LSEQArray.prototype.applyInsert = function(e, i){
    var couple = new C(e, i);
    // #1 binarysearch of the identifier
    var position = this._array.binaryIndexOf(couple)
    // #2 insert in the rightfull position
    if (position<0){ // it does not exists yet
	this._array.splice(Math.abs(position),0, couple);
	this.length += 1;
    };
};

/*!
 * \brief delete the element with the targeted identifier
 * \param i the identifier of the element
 */
LSEQArray.prototype.applyRemove = function(i){
    var couple = new C(null, i);
    // #1 binarysearch of the identifier
    var position = this._array.binaryIndexOf(couple);
    // #2 if exists then delete
    if (position > 0){ // the element exists
	this._array.splice(position,1);
	this.length -= 1;
    };
};

/**
 * \from: [https://gist.github.com/Wolfy87/5734530]
 * Performs a binary search on the host array. This method can either be
 * injected into Array.prototype or called with a specified scope like this:
 * binaryIndexOf.call(someArray, searchElement);
 *
 *
 * @param {*} searchElement The item to search for within the array.
 * @return {Number} The index of the element which defaults to -1 when not
 * found.
 */
Array.prototype.binaryIndexOf = function(searchElement) {
    var minIndex = 0;
    var maxIndex = this.length - 1;
    var currentIndex;
    var currentElement;
    
    while (minIndex <= maxIndex) {
	currentIndex = Math.floor((minIndex + maxIndex) / 2);
	currentElement = this[currentIndex];
	if (currentElement.compare(searchElement) < 0) {
            minIndex = currentIndex + 1;
	}
	else if (currentElement.compare(searchElement) > 0) {
            maxIndex = currentIndex - 1;
	}
	else {
            return currentIndex;
	}
    }; 
    return ~maxIndex;
};

module.exports = LSEQArray;
