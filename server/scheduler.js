// TODO : 예외 처리 sms 보내기 - 네이버 sens에 추가로 이용
const schedule = require("node-schedule");
const request = require("request");
const moment = require("moment");
const parseString = require("xml2js").parseString;

const database = require("./config/database");

const createItemModel = require("./models/item");

const LOGGER = require("./logger");

const bubjungdongList1 = require("./ADDRESS_DB1");
const bubjungdongList2 = require("./ADDRESS_DB2");

let itemModel;
let saveDataList = [];

// 데이터베이스 연결.
database.connect();

// 1. 시작.
function init(list) {
  saveDataList = [];
  // 새로운 모델 만들어주고.
  itemModel = createItemModel();
  getArchInfoByList(list);
}

// 2. 리스트를 돌면서 하나씩 통신해서 데이터를 가져온다. 이때 요청은 동기로 진행된다.
async function getArchInfoByList(list) {
  // 조회 기간은 오늘부터 4주 전으로 한다.
  const startDate = moment()
    .subtract(+4, "weeks")
    .format("YYYYMMDD");

  const endDate = moment().format("YYYYMMDD");

  let count = 0;
  for (var i in list) {
    count++;
    await $httpGetArchInfo(i, startDate, endDate);
    if (count >= 50) {
      break;
    }
  }
  //다 돌면 디비에 저장하기
  saveData(startDate, endDate);
}

// 3. 서버와 통신해서 데이터를 가져온다.
function $httpGetArchInfo(code, startDate, endDate) {
  return new Promise(function(resolve, reject) {
    request.get(
      {
        uri: "http://apis.data.go.kr/1611000/ArchPmsService/getApBasisOulnInfo",
        qs: {
          serviceKey: decodeURIComponent("uu2nV0CiVbjDhdcZyHf0FmfnmNdXX45Af3Ukoih3pf4i1kKriVsxdGcmWjx7DBgGRFIlVYxhOmboQu4By9X1vQ%3D%3D"),
          sigunguCd: code.slice(0, 5),
          bjdongCd: code.slice(5, 10),
          platGbCd: "0",
          bun: "",
          ji: "",
          startDate,
          endDate,
          numOfRows: "100",
          pageNo: 1
        }
      },
      // 실패 하더라도 일단 무조건 넘어가야 함.
      function(error, response, body) {
        if (!error) {
          if (response.statusCode === 200) {
            let items;
            // xml 파싱 준비
            items = body.slice(body.indexOf("<items>"), body.lastIndexOf("</items>") + 8);
            if (items) {
              // xml 파싱
              parseString(items, (err, result) => {
                if (!err) {
                  result.items.item.forEach((elem, index) => {
                    const data = elem;
                    let item = {};
                    for (var j in data) {
                      item[j] = data[j][0];
                    }
                    saveDataList.push(item);
                  });
                  // 제대로 파싱까지 성공
                  resolve();
                } else {
                  // xml 파싱 과정 중 에러난 경우
                  resolve();
                }
              });
            } else {
              // 아이템이 없는 경우
              resolve();
            }
          } else {
            // 200 응답이 아닌 경우
            resolve();
          }
        } else {
          LOGGER.info(`${code} 정부 RestAPI 요청 실패, 에러 : ${error.message}`);
          resolve();
        }
      }
    );
  });
}

// 데이터베이스에 저장한다.
function saveData(startDate, endDate) {
  itemModel.collection.insertMany(saveDataList, function(err) {
    if (err) {
      LOGGER.info(`${startDate} ~ ${endDate} : 데이터베이스 저장 실패`);
    } else {
      LOGGER.info(`기간 : ${startDate} ~ ${endDate}, ${saveDataList.length}개 데이터베이스 저장 성공`);
    }
  });
}

// 월요일 아침 10시 30분 마다 수집
function startScheduler1() {
  var j = schedule.scheduleJob({ hour: 10, minute: 30, dayOfWeek: 1 }, function() {
    try {
      init(bubjungdongList1);
    } catch (error) {
      console.log(error);
    }
  });
}

// 화요일 아침 10시 30분 마다 수집
function startScheduler2() {
  var j = schedule.scheduleJob({ hour: 10, minute: 30, dayOfWeek: 2 }, function() {
    try {
      init(bubjungdongList2);
    } catch (error) {
      console.log(error);
    }
  });
}

init(bubjungdongList1);
//startScheduler();
