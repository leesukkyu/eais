const express = require('express');

const router = express.Router();

const request = require('request');

const EAIS_KEY = require('../config/key').EAIS_KEY;

const parseString = require('xml2js').parseString;

const Info = require('../models/Info');

// 프록시 역할.
router.get('/search', function (req, res, next) {
  request.get(
    {
      uri: 'http://apis.data.go.kr/1611000/ArchPmsService/getApHsTpInfo',
      qs: {
        ...req.query,
        serviceKey: decodeURIComponent(EAIS_KEY),
      },
    },
    function (error, response, body) {
      console.log(error, response, body);
      console.log(parseString);
      parseString(body, (err, result) => {
        console.log(result.response.body[0]);
        res.send(result.response.body[0]);
      });
    },
  );
});

// 일자별 조회
router.get('/collection/:page', function (req, res, next) {
  let query = {};
  const { page } = req.params;
  const { sidoCd, sigunguCd, sortType } = req.query;

  // 구까지 검색한 경우
  if (sigunguCd) {
    query['sigunguCd'] = {
      $eq: sigunguCd,
    };
  }
  // 시만 검색한 경우
  else if (sidoCd) {
    query['sidoCd'] = {
      $eq: sidoCd,
    };
  }

  const options = {
    sort: { [sortType]: -1 },
    limit: 10,
    page: page ? page : 1,
  };

  Info.paginate(query, options)
    .then(function (result) {
      res.json(result);
    })
    .catch(function () {
      res.status(500).send();
    });
});

// 엑셀 다운로드
router.get('/filedownload', function (req, res, next) {
  const type = req.query.type;
  const endDate = req.query.startDate > req.query.endDate ? req.query.startDate : req.query.endDate;
  const startDate = req.query.startDate > req.query.endDate ? req.query.endDate : req.query.startDate;
  const KEY_MAP = {
    archArea: '건축면적',
    archGbCd: '건축구분코드명',
    archGbCdNm: '건축구분코드',
    archPmsDay: '건축허가일',
    atchBldDongCnt: '부속건축물동수',
    bcRat: '건폐율(%)',
    bjdongCd: '법정동코드',
    bldNm: '건물명',
    block: '블록',
    bun: '번',
    crtnDay: '정부측 데이터 생성일',
    fmlyCnt: '가구수(가구)',
    guyukCd: '구역코드',
    guyukCdNm: '구역코드명',
    hhldCnt: '세대수',
    hoCnt: '호수',
    ji: '지',
    jiguCd: '지구코드',
    jiguCdNm: '지구코드명',
    jimokCd: '지목코드',
    jimokCdNm: '지목코드명',
    jiyukCd: '지역코드',
    jiyukCdNm: '지역코드명',
    lot: '로트',
    mainBldCnt: '주건축물수',
    mainPurpsCd: '주용도코드',
    mainPurpsCdNm: '주용도코드명',
    mgmPmsrgstPk: '관리허가대장',
    platArea: '대지면적',
    platGbCd: '대지구분코드',
    platPlc: '대지위치',
    realStcnsDay: '실제착공일',
    rnum: '순번',
    sigunguCd: '시군구코드',
    splotNm: '특수지명',
    stcnsDelayDay: '착공연기일',
    stcnsSchedDay: '착공예정일',
    totArea: '연면적',
    totPkngCnt: '총주차수',
    useAprDay: '사용승일인',
    vlRat: '용적률',
    vlRatEstmTotArea: '용적률산적면적',
    time: '우리측 수집일',
  };

  const EXCEL_ROW_LIST = [
    'platPlc',
    'bldNm',
    'splotNm',
    'archGbCdNm',
    'jimokCdNm',
    'jiyukCdNm',
    'jiguCdNm',
    'platArea',
    'archArea',
    'bcRat',
    'totArea',
    'stcnsSchedDay',
    'stcnsDelayDay',
    'realStcnsDay',
    'archPmsDay',
    'useAprDay',
    'crtnDay',
    'time',
  ];

  let query = { [type]: { $gte: startDate, $lte: endDate } };
  const { sigunguCd, sidoCd } = req.query;
  if (sigunguCd) {
    query['sigunguCd'] = { $eq: sigunguCd };
  } else if (sidoCd) {
    query['sidoCd'] = { $eq: sidoCd };
  }
  Info.find(query)
    .then((docs) => {
      if (docs && docs.length) {
        const result = docs.map((item) => {
          var obj = {};
          EXCEL_ROW_LIST.map((i) => {
            key = KEY_MAP[i];
            if (key) {
              obj[key] = item._doc[i];
            }
          });
          return obj;
        });
        res.xls('data.xlsx', result);
      } else {
        res.json({
          result : '결과 데이터가 없습니다.'
        });
      }
    })
    .catch(() => {
      res.json([]);
    });
});

module.exports = router;
