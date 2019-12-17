import React from "react";
import "./App.css";

import $ from "jquery";
import axios from "axios";
import Icon from "@material-ui/core/Icon";

import NativeSelect from "@material-ui/core/NativeSelect";
import Button from "@material-ui/core/Button";

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
        </div>
      </div>
    );
  }
}

export default App;
