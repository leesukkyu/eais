var express = require("express");
var router = express.Router();
const request = require("request");
const parseString = require("xml2js").parseString;

router.get("/getList", function(req, res, next) {
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

router.get("/getCollection", function(req, res, next) {
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

function requestData() {
  // serviceKey: decodeURIComponent(ARCH_KEY),
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
