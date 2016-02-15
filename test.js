var lokijs = require('lokijs');

var db = new lokijs('loki.json')

var test = {name:'Sleipnir', legs: 8}

var children = db.addCollection('URLInfo')
children.insert(test)

console.log(test)

var childrenZwei = db.addCollection('RSSOutput')
childrenZwei.insert(test)

console.log(children.get(1));
console.log(childrenZwei.get(1));


