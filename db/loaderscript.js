load('wasteresources.js')
for (i in myData) {
  var doc = myData[i]
  print(doc)
  db.wasteresources.insert(doc)
}

print('done inserting documents into db')

db.wasteresources.ensureIndex({ keywords: 'text', title: 'text' })
