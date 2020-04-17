// TODO : 예외 처리 sms 보내기 - 네이버 sens에 추가로 이용
const schedule = require('node-schedule');
const request = require('request');
const moment = require('moment');
const fs = require('fs');

const parseString = require('xml2js').parseString;

const database = require('./config/database');

const InfoModel = require('./models/Info');

const LOGGER = require('./logger');

const bubjungdongList = require('./ADDREDD_DB_LIST');

const EAIS_KEY = require('./config/key').EAIS_KEY;

let CURRENT_INDEX = 0;

let httpCount = 0; // 요청수

let saveDataList = []; // 저장할 데이터

// 1. 시작.
function init(list) {
  httpCount = 0; //  요청수 초기화
  saveDataList = []; // 저장할 데이터 초기화
  getArchInfoByList(list);
}

// 2. 리스트를 돌면서 하나씩 통신해서 데이터를 가져온다. 이때 요청은 동기로 진행된다.
async function getArchInfoByList(list) {
  // 조회 기간은 오늘부터 3개월 전으로 한다.
  const startDate = moment().subtract(3, 'months').format('YYYYMMDD');

  const endDate = moment().format('YYYYMMDD');
  var i = CURRENT_INDEX;
  for (i; i < list.length; i++) {
    if (httpCount > 9000) {
      break;
    }
    await $httpGetArchInfo(list[i].code, startDate, endDate, 1);
    // 매번 저장하자
    saveData(startDate, endDate, saveDataList);
    saveDataList = [];
    //await $httpGetArchInfo('1168010300', startDate, endDate, 1);
  }
  if (i >= list.length) {
    CURRENT_INDEX = 0;
  } else {
    CURRENT_INDEX = i;
  }
  LOGGER.info(`한 사이클 완료`);
}

// 3. 서버와 통신해서 데이터를 가져온다.
function $httpGetArchInfo(code, startDate, endDate, pageNo) {
  return new Promise((resolve, reject) => {
    httpCount++;
    request.get(
      {
        uri: 'http://apis.data.go.kr/1611000/ArchPmsService/getApBasisOulnInfo',
        qs: {
          serviceKey: decodeURIComponent(EAIS_KEY),
          sigunguCd: code.slice(0, 5),
          bjdongCd: code.slice(5, 10),
          platGbCd: '',
          bun: '',
          ji: '',
          startDate,
          endDate,
          numOfRows: '100',
          pageNo: pageNo,
        },
      },
      // 실패 하더라도 일단 무조건 넘어가야 함.
      function (error, response, body) {
        if (!error) {
          if (response.statusCode === 200) {
            let items;
            // xml 파싱 준비
            items = body.slice(body.indexOf('<items>'), body.lastIndexOf('</items>') + 8);
            if (items) {
              // xml 파싱
              parseString(items, async function (err, result) {
                if (!err) {
                  result.items.item.forEach((elem, index) => {
                    const data = elem;
                    let item = {};
                    for (var j in data) {
                      item[j] = data[j][0];
                    }
                    if (item.sigunguCd) {
                      item.sidoCd = item.sigunguCd.slice(0, 2);
                    }
                    saveDataList.push(item);
                  });
                  // 제대로 파싱까지 성공
                  if (result.items.item.length >= 100) {
                    LOGGER.info(`${startDate} ~ ${endDate} : 조회 결과 100개가 넘는 법정동이 있음.`);
                    await $httpGetArchInfo(code, startDate, endDate, pageNo + 1);
                  }
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
      },
    );
  });
}

// 데이터베이스에 저장한다.
function saveData(startDate, endDate, saveDataList) {
  fs.writeFileSync('./CURRENT_INDEX.json', JSON.stringify(CURRENT_INDEX));
  InfoModel.insertMany(saveDataList, { ordered: false }, function (err) {
    if (err && err.code != 11000) {
      LOGGER.info(`${startDate} ~ ${endDate} : 데이터베이스 저장 실패1`);
    } else if (err) {
      LOGGER.info(`${startDate} ~ ${endDate} : 데이터베이스 저장 실패2`);
    } else {
      LOGGER.info(`기간 : ${startDate} ~ ${endDate}, ${saveDataList.length}개 데이터베이스 저장 성공`);
    }
  });
}

// (timezone +9)
// 매일 오후 2시 30분 마다 수집
function startScheduler() {
  var j = schedule.scheduleJob({ hour: 8, minute: 50 }, start);
}

function start() {
  try {
    LOGGER.info(`시작`);
    init(bubjungdongList);
  } catch (error) {
    LOGGER.error(`에러 ------- ${error}`);
  }
}

database.connect().then(() => {
  //start();
  startScheduler();
});
