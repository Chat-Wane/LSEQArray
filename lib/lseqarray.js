/*!
 * \class LSEQArray
 *
 * \brief Distributed array using LSEQ allocation strategy
 */
function LSEQArray(){
    this._c = 0;
    this._hash = function(depth){ return depth%2; };

    this._array = [];
};

/*!
 * \brief return the identifier and element at the targeted index
 * \param index the index of the couple in the array
 * \return a couple {_e: element, _i: identifier}
 */
LSEQ.prototype.get = function(index){

}

/*!
 * \brief insert a value at the targeted index
 * \param element the element to insert
 * \param index the position in the array
 * \return a couple {_e: element , _i: identifier}
 */
LSEQ.prototype.insert = function(element, index){
    // #1 getting the bounds
//    pId = this.lookup(offset);
//    qId = this.lookup(offset+1);
    // #2 generating a path between the bound
//    p = this.alloc(pId._p, pId._q);
    // #3 deduce the sites and counters values
    // #4 insert the new leaf into the structure
};

/*!
 * \brief delete the element at the index
 * \param index the index of the element to delete in the array
 * \return the identifier of the element at the index
 */
LSEQ.prototype.remove = function(index){

};

/*!
 * \brief generate the digit part of the identifiers  between p and q
 * \param p the digit part of the previous identifier
 * \param q the digit part of the next identifier
 * \return the digit part located between p and q
 */
LSEQ.prototype.alloc = function (p,q){

};

/*!
 * \brief insert an element created from a remote site into the array
 * \param e the element to insert
 * \param i the identifier of the element
 */
LSEQ.prototype.applyInsert = function(e, i){

};

/*!
 * \brief delete the element with the targeted identifier
 * \param i the identifier of the element
 */
LSEQ.prototype.applyRemove = function(i){

};

