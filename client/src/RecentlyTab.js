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

import bubjungdongList from "./public/ADDRESS_DB.json";

import moment from "moment";

import TablePagination from "@material-ui/core/TablePagination";

import { COLLECTION_SEARCH_URL } from "./public/CONFIG";

moment.lang("ko", {
  weekdays: ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"],
  weekdaysShort: ["일", "월", "화", "수", "목", "금", "토"]
});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mondayList: [],
      searchMonday: ""
    };
    this.onClickSearchBtn = this.onClickSearchBtn.bind(this);
    this.onChangeMondaySelect = this.onChangeMondaySelect.bind(this);
  }

  componentDidMount() {
    this.makeMondayList();
  }

  makeMondayList() {
    window.moment = moment;
    let mondayList = [];
    let thisMonday = moment().startOf("isoweek");
    let thisMondayFormat = thisMonday.format("YYYYMMDD");
    mondayList.push(thisMondayFormat);
    for (let i = 0; i < 8; i++) {
      mondayList.push(thisMonday.subtract(1, "weeks").format("YYYYMMDD"));
    }
    this.setState({
      ...this.state,
      searchMonday: thisMondayFormat,
      mondayList
    });
  }

  // 검색하기 누른 경우
  onClickSearchBtn() {
    axios.get(`${COLLECTION_SEARCH_URL}/${this.state.searchMonday}`).then(rs => {
      console.log(rs);
    });
  }

  onChangeMondaySelect(e) {
    this.setState({
      ...this.state,
      searchMonday: e.target.value
    });
  }

  render() {
    const { mondayList, searchMonday } = this.state;
    return (
      <div>
        <div style={{ padding: "25px" }}>
          <div style={{ margin: "10px" }}>
            <NativeSelect
              style={{
                marginRight: "20px"
              }}
              value={searchMonday}
              onChange={this.onChangeMondaySelect}
            >
              <option>수집일 선택</option>
              {mondayList.map((item, index) => {
                return (
                  <option key={index} value={item}>
                    {`${moment("" + item)
                      .subtract(4, "weeks")
                      .format("YYYY-MM-DD (ddd)")} 
                      / 
                      ${moment("" + item).format("YYYY-MM-DD (ddd)")}`}
                  </option>
                );
              })}
            </NativeSelect>
            <Button color="secondary" onClick={this.onClickSearchBtn}>
              최신 데이터 검색하기<Icon>search</Icon>
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
