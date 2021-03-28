const objCmp = (objA, objB) => {
    if (objA.toString() === objB.toString()) {
        return true;
    } else {
        return false;
    }
};

module.exports = {objCmp};