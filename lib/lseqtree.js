var Node = require("./node.js");

/*!
 * \class LSEQTree
 *
 * \brief The exponential tree of LSEQ
 * \param base the departure base, i.e., maximum value of the tree at depth 0
 * \param s the unique site identifier
 */
function LSEQTree(base, s){
    this._s = s;
    this._c = 0;
    this._base = base || 32;
    this._hash = function(depth){ return depth%2; };
    this._pMax = function(depth){ return base * Math.pow(2,depth); };
    this._root = new Node(null,0);

    this._root.addLeaf(null, [0]);
    this._root.addLeaf(null, [this._base]);
};

/*!
 * \brief return the path and the leaf at the offset
 * \param offset the offset of the element in the sequence
 * \return a couple {_l: the leaf, _p: the path}
 */
LSEQ.prototype.lookup = function(offset){
    var found = false;
    var leftSum = 0;
    var currentNode = this._root;
    var result = null;
    var p = [];

    while (!found){
	var i=0;
	var keys = Object.keys(currentNode._children);
	while((i < keys.length ) &&
	      (leftSum + currentNode._children[keys[i]]._size < offset)){
	    leftSum += currentNode._children[keys[i]]._size;
	    ++i;
	}
	if (i >= keys.length || currentNode._children.length == 0){
	    // inside diz node
	    currentNode._leaves.sort(function(l1, l2){
		return l1.compare(l2); }); // ascending
	    result = {_l: currentNode._leaves[offset-leftSum], _p:p };
	    found = true;
	} else {
	    p.push[keys[i]];
	    currentNode = currentNode._children[keys[i]];
	};
    };
};

/*!
 * \brief insert a value at the offset
 * \param value the value to insert
 * \param offset the index in the sequence
 * \return a couple {l: the leaf value, p: its path}
 */
LSEQ.prototype.insert = function(value, offset){
    // #1 getting the bounds
    pId = this.lookup(offset);
    qId = this.lookup(offset+1);
    // #2 generating a path between the bound
    p = this.alloc(pId._p, pId._q);
    // #3 deduce the sites and counters values
    // #4 insert the new leaf into the structure
};

/*!
 * \brief generate a path between p and q
 * \return a path between p and q
 */
LSEQ.prototype.alloc = function (p,q){

};

/*!
 * \brief insert the leaf created from another site into the tree
 * \param l the leaf to insert
 * \param p the path of the leaf
 */
LSEQ.prototype.insertLeaf = function(l, p){
    this._root.insertLead(l, p);
};

/*!
 * \brief delete operation from a another site
 * \param l the leaf to be removed
 * \param p the path of the leaf
 */
LSEQ.prototype.deleteLeaf = function(l, p){
    this._root.deleteLeaf(l, p);
};

