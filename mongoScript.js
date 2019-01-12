conn = new Mongo();
allMadMen = null;
db = conn.getDB('shopifychallenge');

load("wasteresources.js");
for(i in myData){
  var doc = myData[i];
  db.wasteresources.insert(doc);
}

db.wasteresources.ensureIndex({ keywords: "text", title: "text"});
