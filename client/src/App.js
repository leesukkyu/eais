import React from "react";
import "./App.css";

import $ from "jquery";
import axios from "axios";
import Icon from "@material-ui/core/Icon";
import FileSaver from "file-saver";

import NativeSelect from "@material-ui/core/NativeSelect";
import Button from "@material-ui/core/Button";
import "./addList.js";

var url =
  "http://apis.data.go.kr/1611000/ArchPmsService/getApHsTpInfo?serviceKey=uu2nV0CiVbjDhdcZyHf0FmfnmNdXX45Af3Ukoih3pf4i1kKriVsxdGcmWjx7DBgGRFIlVYxhOmboQu4By9X1vQ%3D%3D";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sidoCode: "",
      sidoList: [],
      sigoonCode: "",
      sigoonList: [],
      dongCode: "",
      dongList: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.$httpLoadArchInfo = this.$httpLoadArchInfo.bind(this);
    this.$searchBubjungdong = this.$searchBubjungdong.bind(this);
  }

  componentDidMount() {
    this.$httpLoadSidoCodeList();
  }

  $httpLoadSidoCodeList() {
    axios
      .get(
        "http://openapi.nsdi.go.kr/nsdi/eios/service/rest/AdmService/admCodeList.json",
        {
          params: { authkey: "12685d425f1af0872d756c" }
        }
      )
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
      .get(
        "http://openapi.nsdi.go.kr/nsdi/eios/service/rest/AdmService/admSiList.json",
        {
          params: {
            admCode: sidoCode,
            authkey: "b0888bae39fbd0463a9252"
          }
        }
      )
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
      .get(
        "http://openapi.nsdi.go.kr/nsdi/eios/service/rest/AdmService/admDongList.json",
        {
          params: {
            admCode: sigoonCode,
            authkey: "91afccaa8d7f499151ee3b"
          }
        }
      )
      .then(({ data }) => {
        this.setState({
          ...this.state,
          dongCode: "",
          dongList: data.admVOList.admVOList
        });
      });
  }
  $httpLoadArchInfo() {
    axios
      .get("/1611000/ArchPmsService/getApHsTpInfo", {
        params: {
          serviceKey: decodeURIComponent(
            "uu2nV0CiVbjDhdcZyHf0FmfnmNdXX45Af3Ukoih3pf4i1kKriVsxdGcmWjx7DBgGRFIlVYxhOmboQu4By9X1vQ%3D%3D"
          ),
          sigunguCd: "11680",
          bjdongCd: "10800",
          platGbCd: "0",
          bun: "",
          ji: "",
          startDate: "",
          endDate: "",
          numOfRows: "10",
          pageNo: "1"
        }
      })
      .then(() => {
        console.log("xx");
      });
  }

  $searchBubjungdong() {
    axios
      .get(
        "https://gist.githubusercontent.com/FinanceData/4b0a6e1818cea9e77496e57b84bb4565/raw/b682e526c7e9ebd1c30f688b789aa018f396e1c9/%25EB%25B2%2595%25EC%25A0%2595%25EB%258F%2599%25EC%25BD%2594%25EB%2593%259C%25EC%25A0%2584%25EC%25B2%25B4%25EC%259E%2590%25EB%25A3%258C.txt"
      )
      .then(function(rs) {
        var rowList = rs.data.split("\n");
        var colList;
        var map = {};
        for (var i in rowList) {
          colList = rowList[i].split("	");
          for (var j in colList) {
            if (
              colList[2] == "존재" &&
              colList[0][7] == "0" &&
              colList[0][8] == "0" &&
              colList[0][9] == "0"
            ) {
              map[colList[0]] = colList[1];
            }
          }
        }
        debugger;
        var blob = new Blob([JSON.stringify(map)], {
          type: "text/plain;charset=utf-8"
        });
        FileSaver.saveAs(blob, "hello world.txt");

        FileSaver.saveAs();
        console.log(map);
      });
  }

  handleChange(name, event) {
    this.setState(
      {
        ...this.state,
        [name]: event.target.value
      },
      () => {
        if (name == "sidoCode") {
          this.$httpLoadSigoonCodeList();
        } else if (name == "sigoonCode") {
          this.$httpLoadDongCodeList();
        }
      }
    );
  }

  render() {
    const { state } = this;
    const { sidoList, sigoonList, dongList } = state;
    return (
      <div>
        <div style={{ padding: "25px" }}>
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

          <Button color="secondary" onClick={this.$httpLoadArchInfo}>
            검색하기<Icon>search</Icon>
          </Button>

          <Button onClick={this.$searchBubjungdong}>법정동 검색하기</Button>
        </div>
      </div>
    );
  }
}

export default App;
