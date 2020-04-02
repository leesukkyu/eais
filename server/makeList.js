const fs = require('fs');

const bubjungdongList1 = require('./ADDRESS_DB1');
const bubjungdongList2 = require('./ADDRESS_DB2');

var list = [];

for (var i in bubjungdongList1) {
  list.push({
    code: i,
    text: bubjungdongList1[i],
  });
}

for (var i in bubjungdongList2) {
  list.push({
    code: i,
    text: bubjungdongList2[i],
  });
}

console.log(list.length);
fs.writeFileSync('./ADDREDD_DB_LIST', JSON.stringify(list));
