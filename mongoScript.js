conn = new Mongo("ds155614.mlab.com:55614");
db = conn.getDB('heroku_r30zcvb0');

print('hello');

load("wasteresources.js");
for(i in myData){
  var doc = myData[i];
  print(doc);
  db.wasteresources.insert(doc);
}

db.wasteresources.ensureIndex({ keywords: "text", title: "text"});
