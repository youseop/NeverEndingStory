const objCmp = (objA, objB) => {
    if (objA && objB &&  objA.toString() === objB.toString()) {
        return true;
    } else {
        return false;
    }
};

module.exports = {objCmp};