"use strict";

function getCollection(packageObj) {
    if (!packageObj) throw "invalid package!";

    var collectionOn = db.getCollection(packageObj.name);
    if (!collectionOn) throw "invalid package!";

    return collectionOn;
}

function getItems(packageObj) {

    return getCollection(packageObj).data;
}

function addItem(packageObj, item) {
    getCollection(packageObj).insert(item);
}


module.exports.getItems = getItems;
module.exports.addItem = addItem;