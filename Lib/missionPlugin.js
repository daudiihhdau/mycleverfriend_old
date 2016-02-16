"use strict";

function getItems(packageObj) {

    if (!packageObj) throw "invalid package!";

    var collectionOn = db.getCollection(packageObj.name);
    if (!collectionOn) throw "invalid package!";

    return collectionOn.chain().data();
}


module.exports.getItems = getItems;