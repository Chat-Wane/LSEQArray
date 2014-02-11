var Base = new (require('./base.js'))(3);
var S = require('./strategies.js');

/*!
 * \class LSEQArray
 *
 * \brief Distributed array using LSEQ allocation strategy
 */
function LSEQArray(){
    this._c = 0;
    this._hash = function(depth){ return depth%2; };

    this._array = []; // array of couples {_e: element, _i: identifier}
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
    this.applyInsert(couple);
    return couple;
};

/*!
 * \brief delete the element at the index
 * \param index the index of the element to delete in the array
 * \return the identifier of the element at the index
 */
LSEQArray.prototype.remove = function(index){
    var id = this.get(index);
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
    var interval = 0;
    var level = 0;
    while ( interval <= 0 ){ // no room for insertions
	interval = Base.getInterval(p, q, level);
	++level;
    };
    
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
    var couple = {_e:e, _i:i};
    // #1 binarysearch of the identifier
    // #2 insert in the rightfull position
    // this._array.splice(position,0, couple);
};

/*!
 * \brief delete the element with the targeted identifier
 * \param i the identifier of the element
 */
LSEQArray.prototype.applyRemove = function(i){
    // #1 binarysearch of the identifier
    // #2 if exists then delete
    // this._array.splice(position,1);
};

