const objCmp = (objA, objB) => {
    if (objA && objB) {
        objA = typeof objA === "string" ? objA : objA.toString()
        objB = typeof objB === "string" ? objB : objB.toString()
        if (objA === objB)
            return true;
        else
            return false;
    }
    else {
        return false;
    }
};

module.exports = { objCmp };