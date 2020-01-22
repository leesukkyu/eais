const express = require("express");

const router = express.Router();

const request = require("request");

const parseString = require("xml2js").parseString;

const createItemModel = require("../models/item");

// 프록시 역할.
router.get("/search", function(req, res, next) {
  request.get(
    {
      uri: "http://apis.data.go.kr/1611000/ArchPmsService/getApHsTpInfo",
      qs: req.query
    },
    function(error, response, body) {
      console.log(error, response, body);
      console.log(parseString);
      parseString(body, (err, result) => {
        console.log(result.response.body[0]);
        res.send(result.response.body[0]);
      });
    }
  );
});

// 일자별 조회
router.get("/collection/:dateFormat", function(req, res, next) {
  const dateFormat = req.params.dateFormat; // 월요일마다 수집하므로 월요일 형식이 옴
  const itemModel = createItemModel(dateFormat);
  itemModel.find({}, function(err, docs) {
    if (!err) {
      res.json(docs);
    } else {
      res.status(500).send();
    }
  });
});

function requestData() {
  // serviceKey: decodeURIComponent(SEARCH_KEY),
  //         sigunguCd: searchCode.slice(0, 5),
  //         bjdongCd: searchCode.slice(5, 10),
  //         platGbCd: "0",
  //         bun: "",
  //         ji: "",
  //         startDate: moment()
  //           .subtract(SEARCH_MONTH, "months")
  //           .format("YYYYMMDD"),
  //         endDate: moment().format("YYYYMMDD"),
  //         numOfRows: "10",
  //         pageNo: tablePage == 0 ? 1 : tablePage
}

module.exports = router;
