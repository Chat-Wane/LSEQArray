/*!**************************************
 * Dependancies : seedrandom.js
 ***************************************/

/*!
 * \class Triplet
 * 
 * \param a First element of triplet tuple.
 * \param b Second element of triplet tuple.
 * \param c Third element of triplet tuple.
 */
function Triplet(a, b, c) {

  // ! The first tuple element.
  this.first = a;

  // ! The second tuple element.
  this.second = b;

  // ! The third tuple element.
  this.third = c;
}

/*!
 * \class Element
 * \extends Triplet
 * 
 * \param value An integer.
 * \param siteID A site identifier.
 * \param clockEntries Site clock entries
 */
function Element(value, siteID, clockEntries) {
  Triplet.call(this, value, siteID, clockEntries);
}

Element.prototype = new Triplet;
Element.prototype.constructor = Element;

/*!
 * \brief  Returns element's value (1rst element).
 * 
 * \return An integer in range of <tt>[0..LevelBase[</tt>.
 */
Element.prototype.getValue = function() {
  return this.first;
}

/*!
 * \brief Returns element's site ID (2nd element).
 * 
 * \return A site identifier.
 */
Element.prototype.getSiteID = function() {
  return this.second;
}

/*!
 * \brief Returns element's clock entries (3rd element).
 * 
 * \return The clock entries.
 */
Element.prototype.getClockEntries = function() {
  return this.third;
}

/*!
 * brief Tests whether an element is equal to another.
 *
 * \param elt Another element.
 */
Element.prototype.equals = function(elt) {
    var res = -1;

    if (this.siteID > elt.getSiteID()) {
        res = 1;
    }
    else if (this.siteID == elt.getSiteID()) {
		res = 1;
	}

    return res;
}

/*!
 * \brief Tests whether 2 set of clock entries are equal.
 *
 * \param entries1 A set of clock entries.
 * \param entries2 Another set of clock entries.
 */
function areEqual(entries1, entries2) {
    res = true;
    
    for(var i in entries1) {
		if(!(i in entries2)) {
			res = false;
		}
	}

    return res;
}

/*!
 * \class LSEQNode
 * \brief A Node of an LSEQ (exponential) tree.
 */
function LSEQNode(){
    this.elements = [];
    this.size = 0;
    this.children = [];
}

/*!
 * \brief Returns the offset of a child node.
 *
 * \param lastLevelID
 */
LSEQNode.prototype.ChildNumber = function(lastLevelID, siteID, clock) {
	var num = 0;
	var found = false;
	var i = 0;
    
    // Find child
	while (!found && i < this.children.length) {
		if (this.children[i] != undefined && this.children[i] != null
				&& this.children[i].isEmpty() == false) {
			
			if (i == lastLevelID) {
				found = true;
			}
			else {
				num += this.children[i].elements.length;
				num += this.children[i].size;
			}
		}
		
		if(!found) {
			++i;
		}
	}

    // Find element
    if (found) {
        var elements = this.children[i].elements;
        
        found = false;
        i = 0;

        while (!found && i < elements.length) {
			if(elements[i].getSiteID() == siteID
				&& areEqual(elements[i].getClockEntries(), clock)) {

				found = true;
			}
			else if (elements[i] != undefined) {
                ++num;
            }

            ++i;
        }
    }
	
	return found ? num : undefined;
}

/*!
 * Returns whether the node has neither children nor element
 */
LSEQNode.prototype.isEmpty = function() {
	return ((this.children.length == 0) && (this.elements.length == 0));
}

/*!
 * \brief Returns a textual representation of the node.
 */
LSEQNode.prototype.toString = function(){
    var repr = '';

    for(var i=0; i<this.elements.length; i++){
        var pos = this.elements[i];

        if(pos != undefined){
            repr += pos.getValue();
        }
    }
    
    for(var i=0; i<this.children.length; i++){
        var child = this.children[i];
      
        if(child != undefined && child != null){
            repr += child.toString();
        }
    }
  
    return repr;
};

/*!
 * \class LSEQTree
 * \brief Exponential tree for LSEQ
 */
function LSEQTree(base, boundary){
    const DEFAULT_BASE = 32;
    const DEFAULT_BOUNDARY = 10;
    
    this._base = base || DEFAULT_BASE;
    this._boundary = boundary || DEFAULT_BOUNDARY;
    this._strategies = [];
    this._strategies[0] = function(step, lowerBound, upperBound){
        Math.seedrandom();
        var offset = Math.floor(Math.random() * step) + 1;
        return lowerBound + offset;
    };
    
    this._strategies[1] = function(step, lowerBound, upperBound){
        Math.seedrandom();
        var offset = Math.floor(Math.random() * step) + 1;
        return upperBound - offset;
    };

    this._seed = '123654';
    this._root = new LSEQNode(null);
    this._root.children[0] = new LSEQNode(null);
    this._root.children[this._base - 1] = new LSEQNode(null);
}

/*!
 * \brief Inserts a new element in the tree.
 *
 * \param value
 *      Value of the new element.
 * \param siteID
 *      Site ID of the new element.
 * \param clockEntries
 *      Clock entries of the new element.
 * \param prevId
 *      ID of the node just before.
 * \param nextId
 *      ID of the node just after.
 *
 * \return ID attributed to the new element.
 */
LSEQTree.prototype.insert = function(value, siteID, clockEntries, prevId, nextId){
    var depth = 0;
    var lowerBound = prevId[depth];
    var upperBound = nextId[depth];
    var interval = upperBound - lowerBound - 1;
    var parentId = this._prefix(prevId, depth - 1);
    
    while(interval < 1){
        depth++;

        if(prevId.length > depth && nextId.length > depth){
            lowerBound = prevId[depth];
            upperBound = nextId[depth];
            parentId = this._prefix(prevId, depth - 1);
        }
        else if(prevId.length > depth && nextId.length <= depth){
            lowerBound = prevId[depth];
            upperBound = this._maxId(depth);
            parentId = this._prefix(prevId, depth - 1);
        }
        else if(prevId.length <= depth && nextId.length <= depth){
            lowerBound = 0;
            upperBound = this._maxId(depth);
            parentId = this._prefix(prevId, depth - 1);
        }
        else{
            if(prevId[depth - 1] != nextId[depth - 1]){
                lowerBound = prevId[depth - 1];
                upperBound = nextId[depth - 1] + 1;
                parentId = this._prefix(prevId, depth - 2);
            }
            else{
                var jump = nextId.length - 1 - depth;
                depth = nextId.length - 1;
            
                if(nextId[depth] > 1){
                    lowerBound = 0;
                    upperBound = nextId[depth];
                    parentId = this._prefix(nextId, depth - 1);
                }
                else{
                    lowerBound = 0;
                    upperBound = this._maxId(depth + 1);
                    parentId = prevId.concat([0]);
              
                    for(var i=1; i<=jump; i++){
                        parentId = parentId.concat([0]);
                    }
                }
            }
        }
        
        interval = upperBound - lowerBound - 1;
    }
    
    var step = Math.min(this._boundary, interval);
    var strategyId = this._h(depth);
    
    var lastDepthId = this._strategies[strategyId](step, lowerBound, upperBound);
    var newId = parentId.concat(lastDepthId);
    
    this.insertWithId(newId, value, siteID, clockEntries);    
    
    return newId;
};

/*!
 * \brief Deletes element with given attributes.
 *
 * \param id
 *      ID of the node that holds the element to delete.
 * \param siteID
 *      ID of the site that inserted the element to delete.
 * \param clockEntries
 *      Clock entries of the site that inserted the element to delete.
 *
 * \return Whether the element was found and deleted.
 */
LSEQTree.prototype.delete = function(id, siteID, clockEntries){
    var parent = this._getNode(this._prefix(id, id.length - 2),
        function(node){node.size--;});
    
    var lastDepthId = id[id.length - 1];
    var node = parent.children[lastDepthId];
    var found = false;
    var i = 0;
    
    while(!found && i<node.elements.length){
        if(node.elements[i].getSiteID() == siteID
            && areEqual(node.elements[i].getClockEntries(), clockEntries)){
                
            node.elements.splice(i, 1);
            node.size++;
            found = true;
        }
        else {
            ++i;
        }
    }
    
    // The node can be physically removed if it has neither element nor child.
    if(node.elements.length == 0 && node.children.length == 0){
        parent.children[lastDepthId] = null;
    }

    return found;
};

/*!
 * \brief Returns ID of the node just before the given offset
 * 
 * Example : getId(0) returns document starting node
 * 
 * \param offset An offset in the document
 */
LSEQTree.prototype._getId = function(offset){
    var id = [0];
    var siteID;
    var clock;
    
    var currentNode = this._root;
    var depth = 0;
    var n = 0;
    var stop = false;

    while (!stop && n < offset) {
        var i = 0;
        
        while (!stop && i < currentNode.children.length) {
			if(currentNode.children[i] != undefined) {
				var childSize = currentNode.children[i].size;
				var childElements = currentNode.children[i].elements.length;
				
				// Child elements
				
				if (childElements > 0) { // Not empty node
					if (n + childElements < offset) {
						n += childElements;
					}
					else {
						var pos = currentNode.children[i].elements[offset - n - 1];
						id[depth] = i;
						siteID = pos.getSiteID();
						clock = pos.getClockEntries();
						stop = true;
					}
				}
				
				// Child children
				
				if(!stop) {
					if (n + childSize < offset) {
						n += childSize;
						++i;
					}
					else {
						currentNode = currentNode.children[i];
						id[depth] = i;
						++depth;
						i = 0;
					}
				}
			}
			else {
				++i;
			}
		}
		
		if(!stop) {
			id[depth] = this._base - 1;
			break;
		}
	}
    
	return {id:id, siteID:siteID, clock:clock};
};

/*!
 * \brief Returns the ID og the strategy of the given level.
 *
 * \param level
 *      A level of the tree.
 */
LSEQTree.prototype._h = function(level){
    Math.seedrandom(this._seed * (level + 1));
    return Math.round(Math.random());
};

/*!
 * \brief Returns the maximum authorized child index for a given depth of the
 * tree.  
 *
 * \param level
 *      A level of the tree.
 */
LSEQTree.prototype._maxId = function(level){
    return this._base * (1 << level);
};

/*!
 * \brief Returns the node corresponding to the given id.
 *
 * If no node corresponds to the given id then a new node is created.
 *
 * \param id
 *      id of the sought node.
 * 
 * \param f
 *      optional function to apply on every node of the path given by the id.
 */
LSEQTree.prototype._getNode = function(id, f){
    var fnode = f || function(node){};
    var node = this._root;
    
    fnode(node);
  
    for(var i=0; i<id.length; i++){        
        if(node.children[id[i]] == undefined || node.children[id[i]] == null){
            node.children[id[i]] = new LSEQNode(null);
        }
        
        node = node.children[id[i]];
        fnode(node);
    }
      
    return node;
};

/*!
 * \brief Returns the number of elements in the tree.
 */
LSEQTree.prototype.size = function(){
    return this._root.size;
};

/*!
 * \brief Returns the given id truncated to the given level.
 *
 * \param id
 *      id to truncate.
 * 
 * \param level
 *      A level of the tree.
 */
LSEQTree.prototype._prefix = function(id, level){
    return id.slice(0, level + 1);
};

/*!
 * \brief Returns a textual representation of the tree.
 */
LSEQTree.prototype.toString = function(){
    return this._root.toString();
};

/*!
 * \brief Insert a given value at a given id.
 * 
 * \param id
 *      ID of the node that will hold the new element.
 * \param vale
 *      Value of the new element.
 * \param siteID
 *      ID of the site that inserted the new element.
 * \param clockEntries
 *      Clock entries of the site that inserted the new element
 */
LSEQTree.prototype.insertWithId = function(id, value, siteID, clockEntries){
    var element = new Element(value, siteID, clockEntries);
    var stop = false;
    var i = 0;
	
	var node = this._getNode(id, function(node){node.size++;});
	node.size--;
    
    while(!stop && i< node.elements.length){
        if(node.elements[i].equals(element) > 0) {
            stop = true;
        }
        else {
            ++i;
        }
    }

    node.elements.splice(i, 0, element);
};

/*!
 * \class LSEQ
 */
function LSEQ(){
    EventEmitter.call(this);
    
    this._tree = new LSEQTree();
}

LSEQ.prototype = Object.create(EventEmitter.prototype);
LSEQ.prototype.constructor = LSEQ;

/*!
 * \brief Inserts the given value at the given offset (local insert).
 * 
 * \param offset
 *      Offset at which the element must be inserted.
 * \param value
 *      Value of the new element.
 * \param siteID
 *      ID of the site that inserted the new element.
 * \param clockEntries
 *      Clock entries of the site that inserted the new element.
 */
LSEQ.prototype.insert = function(offset, value, siteID, clockEntries){
    if(offset < 0 || offset > this.size()){
        throw new Error('Invalid offset');
    }
    
    var prevId = this._tree._getId(offset).id;
    var nextId = this._tree._getId(offset + 1).id;
    
    var id = this._tree.insert(value, siteID, clockEntries, prevId, nextId);
    var nextId = this._tree._getId(offset + 1).id;

    this.emit('edit', {type: 'insert', value:value, id:id, siteID:siteID, clockEntries:clockEntries});
    
    return id;
};

/*!
 * \brief Inserts a new node with the given ID (foreign insert).
 * 
 * \param id
 *      ID of the new node.
 * \param value
 *      Value of the new element.
 * \param siteID
 *      ID of the site that inserted the new element.
 * \param clockEntries
 *      Clock entries of the site that inserted the new element.
 */
LSEQ.prototype.foreignInsert = function(id, value, siteID, clockEntries) {
    
    this._tree.insertWithId(id, value, siteID, clockEntries);

    // Get parent node
    
	var parentId = id.slice(0, id.length - 1);
    var parent = this._tree._getNode(parentId);

    // Get existing parent node
    // [0.0.0] => []
    // [12.3.0] => [12.3]

    var i = parentId.length - 1;

    while(parentId[i] == 0) {
        parentId.pop();
        i = parentId.length - 1;
    }

    // Compute new node offset
    
	var parentOffset = this._getOffset(parentId);
	var num = parent.ChildNumber(id[id.length - 1], siteID, clockEntries);
	var newOffset = parentOffset + num;

    this.emit('foreignInsert', {value:value, id:id, offset:newOffset, siteID:siteID});
	
	return newOffset;
};

/*!
 * \brief Deletes the element at the given offset (local delete).
 *
 * \param offset
 *      Offset of the element to delete.
 */
LSEQ.prototype.delete = function(offset){
    if(offset < 0 || offset > this.size()){
        throw new Error('Invalid offset');
    }

    var x = this._tree._getId(offset);
    var id = x.id;
    var siteID = this._tree._getId(offset).siteID;
    var clockEntries = this._tree._getId(offset).clock;
    
    this._tree.delete(id, siteID, clockEntries);

    this.emit('edit', {type: 'delete', id:id, siteID:siteID, clockEntries:clockEntries});
    
    return id;
};

/*!
 * \brief Deletes the element with the given id.
 *
 * \param id
 *      ID of the node to delete.
 * \param siteID
 *      ID of the site that inserted the element.
 * \param clockEntries
 *      Clock entries of the site that inserted the element.
 */
LSEQ.prototype.foreignDelete = function(id, siteID, clockEntries){
    
    // Get parent node
	var parentId = id.slice(0, id.length - 1);
    var parent = this._tree._getNode(parentId);

    // Get not empty parent node
    // [0.0.0] => []
    // [12.3.0] => [12.3]

    var i = parentId.length - 1;

    while(parentId[i] == 0) {
        parentId.pop();
        i = parentId.length - 1;
    }

    // Compute the offset of the node to delete
    
	var parentOffset = this._getOffset(parentId);
    
	var num = parent.ChildNumber(id[id.length - 1], siteID, clockEntries);
    
	var offset = parentOffset + num;
	
    this._tree.delete(id, siteID, clockEntries);

    this.emit('foreignDelete', {offset:offset});
};

/*!
 * Returns the offset of the node with the given ID.
 *
 * \param id
 *      ID of a node in the LSEQ tree.
 */
LSEQ.prototype._getOffset = function(id) {
	var offset = 0;
	var currentNode = this._tree._root;
	var found = false;
	
	for(var depth = 0 ; depth < id.length ; ++depth) {
		var i = 0;
		
		while(i < id[depth]) {
			var child = currentNode.children[i];
			
			if(child != undefined && child != null) {
				offset += child.elements.length;
				offset += child.children.length;
			}
			
			++i;
		}

        child = currentNode.children[i];
		offset += child.elements.length;
		currentNode = child;
	}
	
	return offset;
};

/*!
 * Returns the number of elements in the LSEQ document.
 */
LSEQ.prototype.size = function(){
    return this._tree.size();
};

/*!
 * Handles edit message.
 */
LSEQ.prototype.onDelivery = function(message){
    if(!message.error) {
        if(message.local) { // Local site edition
			if(message.msg.type == 'insert'){
				this.insert(message.msg.offset, message.msg.value, message.id, message.entries);
			}
			else if(message.msg.type == 'delete'){
				this.delete(message.msg.offset);
			}
        }
        else { // Distant site edition
			if(message.msg.type == 'insert'){
				this.foreignInsert(message.msg.id, message.msg.value, message.msg.siteID, message.msg.clockEntries);
			}
			else if(message.msg.type == 'delete'){
				this.foreignDelete(message.msg.id, message.msg.siteID, message.msg.clockEntries);
			}
        }
    }
    else {
        // Error of causality not supported for now
    }
};

LSEQ.prototype.toString = function(){
	return this._tree.toString();
}
