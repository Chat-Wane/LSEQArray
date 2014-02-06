

/*!
 * \class LSEQLeaf
 * 
 * \brief unique and immutable leaves of lseq
 * \param v the value of the leaf
 * \param s the array of unique identifier of sites
 * \param c the array of counter for each site
 */

function LSEQLeaf(v, s, c){
    this._v = v;
    this._s = s;
    this._c = c;
};


LSEQLeaf.prototype.compare = function(o){
    var i = 0;
    var res = 0;
    while (res == 0 && i < this._s.length){
	if (this._s[i] < o._s[i]){
	    res = -1;
        };
	if (this._s[i] > o._s[i]){
	    res = 1;
	};
	if (res == 0){
	    if (this._c[i] < o._c[i]){
		res = -1;
	    };
	    if (this._c[i] > o._c[i]){
		res = 1;
	    };
	};
	++i;
    };
    return res;
};

module.exports = LSEQLeaf;
