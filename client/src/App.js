import React from "react";
import "./public/App.css";

import axios from "axios";

import Chip from "@material-ui/core/Chip";
import Icon from "@material-ui/core/Icon";
import Input from "@material-ui/core/Input";
import NativeSelect from "@material-ui/core/NativeSelect";
import Button from "@material-ui/core/Button";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableFooter from "@material-ui/core/TableFooter";

import Paper from "@material-ui/core/Paper";

import bubjungdongList from "./public/ADDRESS_DB.js";

import moment from "moment";

import TablePagination from "@material-ui/core/TablePagination";

import {
  SIDO_CODE_URL,
  SIDO_CODE_KEY,
  SIGOON_CODE_URL,
  SIGOON_CODE_KEY,
  DONG_CODE_URL,
  DONG_CODE_KEY,
  ARCH_URL,
  ARCH_KEY
} from "./public/CONFIG";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchMonth: 6,

      sidoCode: "",
      sidoList: [],
      sigoonCode: "",
      sigoonList: [],
      dongCode: "",
      dongList: [],

      searchStr: "",
      searchCode: "",
      searchResultList: [],

      tableList: [],
      tablePage: 0,
      tableTotalCount: 0
    };

    this.handleChange = this.handleChange.bind(this);
    this.$httpLoadArchInfo = this.$httpLoadArchInfo.bind(this);
    this.onClickBubjungdongSearchBtn = this.onClickBubjungdongSearchBtn.bind(
      this
    );
    this.onClickChips = this.onClickChips.bind(this);
    this.onClickSelectSearchBtn = this.onClickSelectSearchBtn.bind(this);
    this.onChangePage = this.onChangePage.bind(this);
    this.onChangeSearchMonth = this.onChangeSearchMonth.bind(this);
  }

  componentDidMount() {
    this.$httpLoadSidoCodeList();
  }

  onClickChips(item) {
    this.setState(
      {
        ...this.state,
        tableList: [],
        tablePage: 0,
        searchCode: item.code
      },
      () => {
        this.$httpLoadArchInfo();
      }
    );
  }

  // 디비 검색
  onClickBubjungdongSearchBtn() {
    const { searchStr } = this.state;
    const searchResultList = [];
    for (var i in bubjungdongList) {
      if (
        bubjungdongList[i].indexOf(searchStr) !== -1 &&
        !(i[7] == "0" && i[8] == "0" && i[9] == "0")
      ) {
        // 현재는 동까지 정보가 입력되어야만 검색 가능
        searchResultList.push({
          code: i,
          name: bubjungdongList[i]
        });
      }
    }
    this.setState({
      ...this.state,
      searchResultList
    });
  }

  onClickSelectSearchBtn() {
    this.setState(
      {
        ...this.state,
        tableList: [],
        tablePage: 0,
        searchCode: this.state.dongCode + "00"
      },
      () => {
        this.$httpLoadArchInfo();
      }
    );
  }

  onChangePage(obj, page) {
    this.setState(
      {
        tableList: [],
        tablePage: page
      },
      () => {
        this.$httpLoadArchInfo();
      }
    );
  }

  onChangeSearchMonth(e) {
    const { searchCode } = this.state;
    if (searchCode) {
      this.setState(
        {
          ...this.state,
          searchMonth: e.target.value,
          tableList: [],
          tablePage: 0
        },
        () => {
          this.$httpLoadArchInfo();
        }
      );
    } else {
      this.setState({
        ...this.state,
        searchMonth: e.target.value
      });
    }
  }

  $httpLoadSidoCodeList() {
    axios
      .get(SIDO_CODE_URL, {
        params: { authkey: SIDO_CODE_KEY }
      })
      .then(({ data }) => {
        this.setState({
          ...this.state,
          sidoList: data.admVOList.admVOList,
          sidoCode: "",
          sigoonCode: "",
          sigoonList: [],
          dongCode: "",
          dongList: []
        });
      });
  }

  $httpLoadSigoonCodeList() {
    const { sidoCode } = this.state;
    axios
      .get(SIGOON_CODE_URL, {
        params: {
          admCode: sidoCode,
          authkey: SIGOON_CODE_KEY
        }
      })
      .then(({ data }) => {
        this.setState({
          ...this.state,
          sigoonCode: "",
          sigoonList: data.admVOList.admVOList,
          dongCode: "",
          dongList: []
        });
      });
  }

  $httpLoadDongCodeList() {
    const { sigoonCode } = this.state;
    axios
      .get(DONG_CODE_URL, {
        params: {
          admCode: sigoonCode,
          authkey: DONG_CODE_KEY
        }
      })
      .then(({ data }) => {
        this.setState({
          ...this.state,
          dongCode: "",
          dongList: data.admVOList.admVOList
        });
      });
  }

  $httpLoadArchInfo() {
    const { searchCode, tablePage, searchMonth } = this.state;
    axios
      .get(ARCH_URL, {
        params: {
          serviceKey: decodeURIComponent(ARCH_KEY),
          sigunguCd: searchCode.slice(0, 5),
          bjdongCd: searchCode.slice(5, 10),
          platGbCd: "0",
          bun: "",
          ji: "",
          startDate: moment()
            .subtract(+searchMonth, "months")
            .format("YYYYMMDD"),
          endDate: moment().format("YYYYMMDD"),
          numOfRows: "10",
          pageNo: tablePage == 0 ? 1 : tablePage
        }
      })
      .then(rs => {
        if (rs.data.items[0]) {
          this.setState({
            ...this.state,
            tableList: rs.data.items[0].item,
            tableTotalCount: rs.data.totalCount[0]
          });
        } else {
          this.setState({
            ...this.state,
            tableList: [],
            tableTotalCount: 0
          });
        }
      });
  }

  handleChange(name, event) {
    this.setState(
      {
        ...this.state,
        [name]: event.target.value
      },
      () => {
        const { searchCode } = this.state;
        if (name === "sidoCode") {
          this.$httpLoadSigoonCodeList();
        } else if (name === "sigoonCode") {
          this.$httpLoadDongCodeList();
        }
      }
    );
  }

  render() {
    const { state } = this;
    const {
      sidoList,
      sigoonList,
      dongList,
      searchStr,
      searchResultList,
      searchCode,
      tableList,
      tablePage,
      tableTotalCount
    } = state;

    return (
      <div>
        <div style={{ padding: "25px" }}>
          <div style={{ margin: "10px" }}>
            최근
            <NativeSelect
              value={state.searchMonth}
              onChange={this.onChangeSearchMonth}
            >
              <option value="1">1개월</option>
              <option value="2">2개월</option>
              <option value="3">3개월</option>
              <option value="4">4개월</option>
              <option value="5">5개월</option>
              <option value="6">6개월</option>
              <option value="7">7개월</option>
              <option value="8">8개월</option>
              <option value="9">9개월</option>
              <option value="10">10개월</option>
              <option value="11">11개월</option>
              <option value="12">12개월</option>
            </NativeSelect>
            개월간 검색
          </div>
          <div>
            <NativeSelect
              style={{
                marginRight: "10px"
              }}
              className="mr-2"
              value={state.sidoCode}
              onChange={e => {
                this.handleChange("sidoCode", e);
              }}
            >
              <option>시/도 선택</option>
              {sidoList.map((item, index) => {
                return (
                  <option key={index} value={item.admCode}>
                    {item.admCodeNm}
                  </option>
                );
              })}
            </NativeSelect>

            <NativeSelect
              style={{
                marginRight: "10px"
              }}
              value={state.sigoonCode}
              onChange={e => {
                this.handleChange("sigoonCode", e);
              }}
            >
              <option>시/군 선택</option>
              {sigoonList.map((item, index) => {
                return (
                  <option key={index} value={item.admCode}>
                    {item.admCodeNm}
                  </option>
                );
              })}
            </NativeSelect>

            <NativeSelect
              style={{
                marginRight: "20px"
              }}
              value={state.dongCode}
              onChange={e => {
                this.handleChange("dongCode", e);
              }}
            >
              <option>동 선택</option>
              {dongList.map((item, index) => {
                return (
                  <option key={index} value={item.admCode}>
                    {item.admCodeNm}
                  </option>
                );
              })}
            </NativeSelect>
            <Button color="secondary" onClick={this.onClickSelectSearchBtn}>
              검색하기<Icon>search</Icon>
            </Button>
          </div>
          <div>
            <Input
              placeholder="주소"
              value={searchStr}
              onChange={e => {
                this.setState({
                  ...this.state,
                  searchStr: e.target.value
                });
              }}
              onKeyUp={e => {
                if (e.keyCode === 13) {
                  this.onClickBubjungdongSearchBtn();
                }
              }}
            />
            <Button
              color="secondary"
              onClick={this.onClickBubjungdongSearchBtn}
            >
              법정동 검색하기<Icon>search</Icon>
            </Button>
          </div>
          <div>
            {searchResultList.map((item, index) => {
              return (
                <Chip
                  key={index}
                  size="small"
                  label={item.name}
                  onClick={() => {
                    this.onClickChips(item);
                  }}
                  deleteIcon={<Icon>search</Icon>}
                  color={searchCode === item.code ? "primary" : "default"}
                  style={{ margin: "5px 5px" }}
                />
              );
            })}
          </div>
          <div
            style={{
              marginTop: "10px",
              minWidth: "1400px"
            }}
          >
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>대지위치</TableCell>
                    <TableCell>대지구분코드</TableCell>
                    <TableCell>건물명</TableCell>
                    <TableCell>대지면적</TableCell>
                    <TableCell>건축면적</TableCell>

                    <TableCell>용적률</TableCell>
                    <TableCell>주건축물수</TableCell>
                    <TableCell>부속건축물동수</TableCell>
                    <TableCell>주용도코드명</TableCell>
                    <TableCell>세대수</TableCell>
                    <TableCell>호수</TableCell>
                    <TableCell>가구수</TableCell>
                    <TableCell>총주차수</TableCell>

                    <TableCell>착공예정일</TableCell>
                    <TableCell>착공연기일</TableCell>
                    <TableCell>실제착공일</TableCell>
                    <TableCell>건축허가일</TableCell>
                    <TableCell>사용승인일</TableCell>

                    <TableCell>실호세대수</TableCell>
                    <TableCell>실호세대수면적</TableCell>

                    <TableCell>생성일자</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tableList.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.platPlc}</TableCell>
                      <TableCell>{item.platGbCd}</TableCell>
                      <TableCell>{item.bldNm}</TableCell>
                      <TableCell>{item.platArea}</TableCell>
                      <TableCell>{item.archArea}</TableCell>

                      <TableCell>{item.vlRat}</TableCell>
                      <TableCell>{item.mainBldCnt}</TableCell>
                      <TableCell>{item.atchBldDongCnt}</TableCell>
                      <TableCell>{item.mainPurpsCdNm}</TableCell>
                      <TableCell>{item.hhldCnt}</TableCell>
                      <TableCell>{item.hoCnt}</TableCell>
                      <TableCell>{item.fmlyCnt}</TableCell>
                      <TableCell>{item.totPkngCnt}</TableCell>

                      <TableCell>{item.stcnsSchedDay}</TableCell>
                      <TableCell>{item.stcnsDelayDay}</TableCell>
                      <TableCell>{item.realStcnsDay}</TableCell>
                      <TableCell>{item.archPmsDay}</TableCell>
                      <TableCell>{item.useAprDay}</TableCell>

                      <TableCell>{item.silHoHhldCnt}</TableCell>
                      <TableCell>{item.silHoHhldArea}</TableCell>

                      <TableCell>{item.crtnDay}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TablePagination
                      colSpan={21}
                      count={tableTotalCount}
                      rowsPerPage={10}
                      page={tablePage}
                      SelectProps={{
                        style: {
                          display: "none"
                        }
                      }}
                      onChangePage={this.onChangePage}
                    />
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
            {!tableTotalCount ? <div>데이터가 없습니다.</div> : null}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
