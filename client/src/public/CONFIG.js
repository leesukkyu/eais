export const SEARCH_MONTH = 6;
export const SIDO_CODE_URL = "http://openapi.nsdi.go.kr/nsdi/eios/service/rest/AdmService/admCodeList.json";
export const SIDO_CODE_KEY = "";
export const SIGOON_CODE_URL = "http://openapi.nsdi.go.kr/nsdi/eios/service/rest/AdmService/admSiList.json";
export const SIGOON_CODE_KEY = "";
export const DONG_CODE_URL = "http://openapi.nsdi.go.kr/nsdi/eios/service/rest/AdmService/admDongList.json";
export const DONG_CODE_KEY = "";

export const SEARCH_KEY = "";

const SERVER_URL = process.env.NODE_ENV == "development" ? "http://localhost:5001" : "";

export const SEARCH_URL = `${SERVER_URL}/api/search`;
export const COLLECTION_SEARCH_URL = `${SERVER_URL}/api/collection`;
