
/*!
 * \class A node of a tree

 * \param parent the parent of the node
 * \param depth depth of the node
 */
function Node(parent, depth){
    this._parent = parent;
    this._leaves = new Array[];
    this._children = new Array[];
    this._depth = depth;
    this._size = 0;
};

/*!
 * \brief Add the leaf to local leaves
 * \param l the leaf to add
 * \param p the path where the leaf must be added
 */
Node.prototype.addLeaf = function(l,p){
    if (p.length > 0){ // path goes deeper
	if (!(p[0] in this._children)){ // the node does not exist yet
	    this._children[p[0]] = new Node(this,this._depth +1);
	}
	this._children[p[0]].addLeaf(l,p.shift());
    } else {
	this._leaves.push(l);
    };
    this._size += 1;
};

/*!
 * \brief Remove a leaf from a node. If the node doesnot have leaves, it
 * deletes it too, and parents until it has.
 * \param l the leaf to remove
 * \param p the path of the leaf
 */
Node.prototype.removeLeaf = function(l,p){
    this._size -= 1;
    if (p.length >0){
	this._children[p[0]].removeLeaf(l,p.shift());
	if (this._children[p[0]]._size < 1){// no leaves = delete
	    delete this._children[p[0]];
	};
    } else {
	this._leaves.splice(this._leaves.indexOf(l),1); // delete the leaf
    };
};
