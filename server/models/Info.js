const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");

// 컬렉션 명을 매일 바꿔야 하기 때문에 모델 생성 함수를 export 한다
var schema = new Schema({
  archArea: String, // 건축면적
  archGbCd: String, // 건축구분코드명
  archGbCdNm: String, // 건축구분코드
  archPmsDay: String, // 건축허가일
  atchBldDongCnt: String, // 부속건축물동수
  bcRat: String, // 건폐율(%)
  bjdongCd: String, // 법정동코드
  bldNm: String, // 건물명
  block: String, // 블록
  bun: String, // 번
  crtnDay: String, // 정부측 데이터 생성일
  fmlyCnt: String, // 가구수(가구)
  guyukCd: String, // 구역코드
  guyukCdNm: String, // 구역코드명
  hhldCnt: String, // 세대수
  hoCnt: String, // 호수
  ji: String, // 지
  jiguCd: String, // 지구코드
  jiguCdNm: String, // 지구코드명
  jimokCd: String, // 지목코드
  jimokCdNm: String, // 지목코드명
  jiyukCd: String, // 지역코드
  jiyukCdNm: String, // 지역코드명
  lot: String, // 로트
  mainBldCnt: String, // 주건축물수
  mainPurpsCd: String, // 주용도코드
  mainPurpsCdNm: String, // 주용도코드명
  mgmPmsrgstPk: { // 관리허가대장
    type: String,
    unique: true,
    required: true
  },
  platArea: String, // 대지면적
  platGbCd: String, // 대지구분코드
  platPlc: String, // 대지위치
  realStcnsDay: String, // 실제착공일
  rnum: String, // 순번
  sidoCd:String,  // 시도 코드
  sigunguCd: String, // 시군구코드
  splotNm: String, // 특수지명
  stcnsDelayDay: String, // 착공연기일
  stcnsSchedDay: String, // 착공예정일
  totArea: String, // 연면적
  totPkngCnt: String, // 총주차수
  useAprDay: String, // 사용승일인
  vlRat: String, // 용적률
  vlRatEstmTotArea: String, // 용적률산적면적
  time: { type: Date, default: Date.now } // 우리측 수집일
});

schema.plugin(mongoosePaginate);

module.exports = mongoose.model("Info", schema);
