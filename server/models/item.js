const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment");

// 컬렉션 명을 매일 바꿔야 하기 때문에 모델 생성 함수를 export 한다
function createItemModel() {
  var schema = new Schema(
    {
      archArea: String,
      archGbCd: String,
      archGbCdNm: String,
      archPmsDay: String,
      atchBldDongCnt: String,
      bcRat: String,
      bjdongCd: String,
      bldNm: String,
      block: String,
      bun: String,
      crtnDay: String,
      fmlyCnt: String,
      guyukCd: String,
      guyukCdNm: String,
      hhldCnt: String,
      hoCnt: String,
      ji: String,
      jiguCd: String,
      jiguCdNm: String,
      jimokCd: String,
      jimokCdNm: String,
      jiyukCd: String,
      jiyukCdNm: String,
      lot: String,
      mainBldCnt: String,
      mainPurpsCd: String,
      mainPurpsCdNm: String,
      mgmPmsrgstPk: String,
      platArea: String,
      platGbCd: String,
      platPlc: String,
      realStcnsDay: String,
      rnum: String,
      sigunguCd: String,
      splotNm: String,
      stcnsDelayDay: String,
      stcnsSchedDay: String,
      totArea: String,
      totPkngCnt: String,
      useAprDay: String,
      vlRat: String,
      vlRatEstmTotArea: String
    },
    {
      collection: moment().format("YYYYMMDD")
    }
  );
  return mongoose.model("Item", schema);
}

module.exports = createItemModel;
