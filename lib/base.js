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
    var m = this._b;
    return (n * (n + 1)) / 2 - (m * (m + 1) / 2);
};

module.exports = Base;
