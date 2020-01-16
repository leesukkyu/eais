const bubjungdongList = require("./ADDRESS_DB");
const database = require("./config/database");
const request = require("request");
const parseString = require("xml2js").parseString;
const moment = require("moment");

database.connect();

function scheduler() {
  let list;
  list = getFilteredList(); // 해당 과정은 법정동에서 동까지의 필터된 파일을 만들면 안해도 된다. 지금은 필터기능을 가져가자.
  getArchInfoByList(list);
}

function getFilteredList() {
  const list = [];
  for (var i in bubjungdongList) {
    if (!(i[7] == "0" && i[8] == "0" && i[9] == "0")) {
      // 현재는 동까지 정보가 입력되어야만 검색 가능
      list.push({
        code: i,
        name: bubjungdongList[i]
      });
    }
  }
  return list;
}

function getArchInfoByList(list) {
  console.log(list);
  list = list.slice(0, 5);
  for (var i in list) {
    $httpGetArchInfo(list[i].code);
  }
}

function $httpGetArchInfo(code) {
  code = '1168010800';
  request.get(
    {
      uri: "http://apis.data.go.kr/1611000/ArchPmsService/getApHsTpInfo",
      qs: {
        serviceKey: decodeURIComponent(
          "uu2nV0CiVbjDhdcZyHf0FmfnmNdXX45Af3Ukoih3pf4i1kKriVsxdGcmWjx7DBgGRFIlVYxhOmboQu4By9X1vQ%3D%3D"
        ),
        sigunguCd: code.slice(0, 5),
        bjdongCd: code.slice(5, 10),
        platGbCd: "0",
        bun: "",
        ji: "",
        startDate: moment()
          .subtract(+12, "months")
          .format("YYYYMMDD"),
        endDate: moment().format("YYYYMMDD"),
        numOfRows: "10",
        pageNo: 1
      }
    },
    function(error, response, body) {
      'http://localhost:3000/api/getList?serviceKey=uu2nV0CiVbjDhdcZyHf0FmfnmNdXX45Af3Ukoih3pf4i1kKriVsxdGcmWjx7DBgGRFIlVYxhOmboQu4By9X1vQ%3D%3D&sigunguCd=11680&bjdongCd=10800&platGbCd=0&bun=&ji=&startDate=20190630&endDate=20191230&numOfRows=10&pageNo=1'
      console.log(error, response, body);
      console.log(parseString);
      parseString(body, (err, result) => {
        console.log(result.response.body[0]);
      });
    }
  );
}

scheduler();
