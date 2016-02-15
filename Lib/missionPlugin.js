"use strict";

function getNextItem(packageObj, callback) {

    if (!packageObj) throw "invalid package!";

    var collectionOn = db.getCollection(packageObj.name);
    if (!collectionOn) throw "invalid package!";

    return collectionOn.chain().data().forEach(function(item){
        callback(null, item);
    });
}


module.exports.getNextItem = getNextItem;