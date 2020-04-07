export const SEARCH_MONTH = 6;
export const SIDO_CODE_URL = 'http://openapi.nsdi.go.kr/nsdi/eios/service/rest/AdmService/admCodeList.json';
export const SIDO_CODE_KEY = '12685d425f1af0872d756c';
export const SIGOON_CODE_URL = 'http://openapi.nsdi.go.kr/nsdi/eios/service/rest/AdmService/admSiList.json';
export const SIGOON_CODE_KEY = 'b0888bae39fbd0463a9252';
export const DONG_CODE_URL = 'http://openapi.nsdi.go.kr/nsdi/eios/service/rest/AdmService/admDongList.json';
export const DONG_CODE_KEY = '91afccaa8d7f499151ee3b';

export const SERVER_URL = process.env.NODE_ENV == 'development' ? 'http://localhost:5500' : '';