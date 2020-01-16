// TODO : 로그, 하루에 10000개만 허용 하기 때문에 이틀에 걸쳐 요청해야 함. 예외 처리 sms 보내기
const schedule = require("node-schedule");
const request = require("request");
const moment = require("moment");
const parseString = require("xml2js").parseString;

const database = require("./config/database");

const createItemModel = require("./models/item");

const bubjungdongList = require("./ADDRESS_DB");

let ItemModel;
let saveDataList = [];

// 데이터베이스 연결.
database.connect();

// 1. 시작.
function init() {
  saveDataList = [];
  // 새로운 모델 만들어주고.
  ItemModel = createItemModel();
  getArchInfoByList(bubjungdongList);
}

// 2. 리스트를 돌면서 하나씩 통신해서 데이터를 가져온다. 이때 요청은 동기로 진행된다.
async function getArchInfoByList(list) {
  let count = 0;
  for (var i in list) {
    count++;
    await $httpGetArchInfo(i);
    if (count >= 2) {
      break;
    }
  }
  // 다 돌면 디비에 저장하기
  saveData();
}

// 3. 서버와 통신해서 데이터를 가져온다.
function $httpGetArchInfo(code) {
  return new Promise(function(resolve, reject) {
    request.get(
      {
        uri: "http://apis.data.go.kr/1611000/ArchPmsService/getApBasisOulnInfo",
        qs: {
          serviceKey: decodeURIComponent(
            "uu2nV0CiVbjDhdcZyHf0FmfnmNdXX45Af3Ukoih3pf4i1kKriVsxdGcmWjx7DBgGRFIlVYxhOmboQu4By9X1vQ%3D%3D"
          ),
          sigunguCd: code.slice(0, 5),
          bjdongCd: code.slice(5, 10),
          platGbCd: "0",
          bun: "",
          ji: "",
          // 조회 기간은 오늘부터 2주 전으로 한다.
          startDate: moment()
            .subtract(+2, "weeks")
            .format("YYYYMMDD"),
          endDate: moment().format("YYYYMMDD"),
          numOfRows: "100",
          pageNo: 1
        }
      },
      function(error, response, body) {
        if (error) {
          resolve();
        } else {
          let items;
          // xml 파싱 준비
          items = body.slice(
            body.indexOf("<items>"),
            body.lastIndexOf("</items>") + 8
          );
          if (items) {
            // xml 파싱
            parseString(items, (err, result) => {
              if (err) {
                resolve();
              } else {
                for (var i in result.items.item) {
                  const data = result.items.item[i];
                  let item = {};
                  for (var j in data) {
                    item[j] = data[j][0];
                  }
                  saveDataList.push(item);
                }
                resolve();
              }
            });
          } else {
            resolve();
          }
        }
      }
    );
  });
}

// 데이터베이스에 저장한다.
function saveData() {
  ItemModel.collection.insertMany(saveDataList, function(err) {
    if (err) {
      return console.error(err);
    } else {
      console.log("저장성공");
    }
  });
}

// 월요일 아침 10시 30분 마다 수집
function startScheduler() {
  var j = schedule.scheduleJob(
    { hour: 10, minute: 30, dayOfWeek: 1 },
    function() {
      try {
        init();
      } catch (error) {
        console.log(error);
      }
    }
  );
}

startScheduler();
