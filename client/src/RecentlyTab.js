import React from "react";

import axios from "axios";

import { makeStyles } from "@material-ui/core/styles";

import Icon from "@material-ui/core/Icon";
import Button from "@material-ui/core/Button";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableFooter from "@material-ui/core/TableFooter";

import LinearProgress from "@material-ui/core/LinearProgress";

import Paper from "@material-ui/core/Paper";

import moment from "moment";

import { COLLECTION_SEARCH_URL } from "./public/CONFIG";

moment.locale("ko", {
  weekdays: [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일"
  ],
  weekdaysShort: ["일", "월", "화", "수", "목", "금", "토"]
});

const useStyles = makeStyles({
  root: {
    width: "100%"
  },
  container: {
    maxHeight: 440
  }
});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      tableList: [],
      rs: {
        docs: [],
        totalDocs: null,
        limit: null,
        totalPages: null,
        page: null,
        pagingCounter: null,
        hasPrevPage: null,
        hasNextPage: null,
        prevPage: null,
        nextPage: 1
      }
    };

    this.onClickLoadBtn = this.onClickLoadBtn.bind(this);
  }

  componentDidMount() {
    this.onClickLoadBtn();
  }

  // 검색하기 누른 경우
  onClickLoadBtn() {
    let page;
    page = this.state.rs.nextPage;
    if (page) {
      this.setState({
        ...this.state,
        isLoading: true
      });
      axios.get(`${COLLECTION_SEARCH_URL}/${page}`).then(rs => {
        this.state.tableList = this.state.tableList.concat(rs.data.docs);
        this.setState({
          ...this.state,
          isLoading: false,
          rs: rs.data
        });
      });
    }
  }

  render() {
    const { tableList, isLoading } = this.state;
    return (
      <React.Fragment>
        <div
          style={{ position: "fixed", width: "100%", top: "44px", zIndex: 1 }}
        >
          {isLoading ? <LinearProgress variant="query" /> : null}
        </div>
        <TableContainer
          component={Paper}
          style={{
            maxHeight: "100%",
            width: "100%",
            boxSizing: "border-box",
            padding: "0"
          }}
        >
          <Table stickyHeader aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>대지위치</TableCell>
                <TableCell>건물명</TableCell>
                <TableCell>특수지명</TableCell>
                <TableCell>블록</TableCell>
                <TableCell>로트</TableCell>

                <TableCell>지목코드명</TableCell>
                <TableCell>지역코드명</TableCell>
                <TableCell>지구코드명</TableCell>
                <TableCell>구역코드명</TableCell>
                <TableCell>건축구분코드명</TableCell>

                <TableCell>대지면적(㎡)</TableCell>
                <TableCell>건축면적(㎡)</TableCell>
                <TableCell>건폐율(%)</TableCell>
                <TableCell>연면적(㎡)</TableCell>

                <TableCell>착공예정일</TableCell>
                <TableCell>착공연기일</TableCell>
                <TableCell>실제착공일</TableCell>
                <TableCell>건축허가일</TableCell>
                <TableCell>사용승인일</TableCell>
                <TableCell>생성일자</TableCell>

                <TableCell>수집일</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableList.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.platPlc}</TableCell>
                  <TableCell>{item.bldNm}</TableCell>
                  <TableCell>{item.splotNm}</TableCell>
                  <TableCell>{item.block}</TableCell>
                  <TableCell>{item.lot}</TableCell>

                  <TableCell>{item.jimokCdNm}</TableCell>
                  <TableCell>{item.jiyukCdNm}</TableCell>
                  <TableCell>{item.jiguCdNm}</TableCell>
                  <TableCell>{item.guyukCd}</TableCell>
                  <TableCell>{item.archGbCd}</TableCell>

                  <TableCell>{item.platArea}</TableCell>
                  <TableCell>{item.archArea}</TableCell>
                  <TableCell>{item.bcRat}</TableCell>
                  <TableCell>{item.totArea}</TableCell>

                  <TableCell>{item.stcnsSchedDay}</TableCell>
                  <TableCell>{item.stcnsDelayDay}</TableCell>
                  <TableCell>{item.realStcnsDay}</TableCell>
                  <TableCell>{item.archPmsDay}</TableCell>
                  <TableCell>{item.useAprDay}</TableCell>
                  <TableCell>{item.crtnDay}</TableCell>

                  <TableCell>{moment(item.time).format("YYYYMMDD")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan="21">
                  <Button color="secondary" onClick={this.onClickLoadBtn}>
                    <Icon>add_box</Icon>
                  </Button>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </React.Fragment>
    );
  }
}

export default App;
