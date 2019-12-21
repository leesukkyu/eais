var express = require("express");
var router = express.Router();
const request = require("request");

/* GET users listing. */
router.get("/getList", function(req, res, next) {
  request.get({ uri: "http://www.google.com" }, function(
    error,
    response,
    body
  ) {
    res.send("respond with a resource");
  });
});

module.exports = router;
