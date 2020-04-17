import React from 'react';
import './public/App.css';

import moment from 'moment';
import 'moment/locale/ko';

import axios from 'axios';

import LinearProgress from '@material-ui/core/LinearProgress';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import DescriptionIcon from '@material-ui/icons/Description';
import IconButton from '@material-ui/core/IconButton';
import MomentUtils from '@date-io/moment';
import NativeSelect from '@material-ui/core/NativeSelect';

import { SIDO_CODE_URL, SIDO_CODE_KEY, SIGOON_CODE_URL, SIGOON_CODE_KEY, SERVER_URL } from './public/CONFIG';

moment.locale('ko');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      startDate: new Date(),
      endDate: new Date(),
      type: 'crtnDay',
      sidoCode: '',
      sidoList: [],
      sigoonCode: '',
      sigoonList: [],
    };
  }

  componentDidMount() {
    this.$httpLoadSidoCodeList();
  }

  // 시/도 불러오기
  $httpLoadSidoCodeList() {
    this.setState({
      isLoading: true,
    });
    axios
      .get(SIDO_CODE_URL, {
        params: { authkey: SIDO_CODE_KEY },
      })
      .then(({ data }) => {
        this.setState({
          isLoading: false,
          sidoCode: '',
          sidoList: data.admVOList.admVOList,
          sigoonCode: '',
          sigoonList: [],
        });
      });
  }

  // 시/군 불러오기
  $httpLoadSigoonCodeList() {
    const { sidoCode } = this.state;
    this.setState({
      isLoading: true,
    });
    axios
      .get(SIGOON_CODE_URL, {
        params: {
          admCode: sidoCode,
          authkey: SIGOON_CODE_KEY,
        },
      })
      .then(({ data }) => {
        this.setState({
          isLoading: false,
          sigoonCode: '',
          sigoonList: data.admVOList.admVOList,
        });
      });
  }

  handleChange = (name, event) => {
    this.setState(
      {
        [name]: event.target.value,
      },
      () => {
        if (name === 'sidoCode') {
          this.$httpLoadSigoonCodeList();
        } else if (name === 'sigoonCode') {
        }
      },
    );
  };

  handleDateChange = (date, type) => {
    this.setState({
      [type]: date,
    });
  };

  handleSelectChange = (e) => {
    this.setState({
      type: e.target.value,
    });
  };

  fetchFile = () => {
    const { type, sigoonCode, sidoCode } = this.state;
    const startDate = moment(this.state.startDate).format('YYYYMMDD');
    const endDate = moment(this.state.endDate).format('YYYYMMDD');
    if (sidoCode || sigoonCode) {
      window.open(
        `${SERVER_URL}/api/filedownload?type=${type}&startDate=${startDate}&endDate=${endDate}&sigunguCd=${sigoonCode}&sidoCd=${sidoCode}`,
      );
    } else {
      window.open(`${SERVER_URL}/api/filedownload?type=${type}&startDate=${startDate}&endDate=${endDate}`);
    }
  };

  render() {
    const { isLoading, startDate, endDate, type } = this.state;
    const { sidoCode, sidoList, sigoonCode, sigoonList } = this.state;
    return (
      <div>
        <div style={{ position: 'fixed', width: '100%', top: '48px', zIndex: 1 }}>
          {isLoading ? <LinearProgress variant="query" /> : null}
        </div>
        <div style={{ padding: '25px' }}>
          <div style={{ margin: '10px' }}>
            <div>
              <NativeSelect
                style={{
                  marginRight: '10px',
                }}
                className="mr-2"
                value={sidoCode}
                onChange={(e) => {
                  this.handleChange('sidoCode', e);
                }}
              >
                <option value="">시/도 선택</option>
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
                  marginRight: '10px',
                }}
                value={sigoonCode}
                onChange={(e) => {
                  this.handleChange('sigoonCode', e);
                }}
              >
                <option value="">전체</option>
                {sigoonList.map((item, index) => {
                  return (
                    <option key={index} value={item.admCode}>
                      {item.admCodeNm}
                    </option>
                  );
                })}
              </NativeSelect>
            </div>
            <FormControl style={{ margin: '16px 20px 8px' }}>
              <InputLabel id="demo-simple-select-label">검색조건</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={type}
                onChange={this.handleSelectChange}
              >
                <MenuItem value={'crtnDay'}>생성일자</MenuItem>
                <MenuItem value={'archPmsDay'}>건축허가일</MenuItem>
              </Select>
            </FormControl>
            <MuiPickersUtilsProvider utils={MomentUtils} locale="ko">
              <DatePicker
                autoOk={true}
                disableToolbar
                variant="inline"
                format="YYYY/MM/DD"
                margin="normal"
                id="date-picker-inline"
                label="검색 시작일"
                value={startDate}
                onChange={(date) => {
                  this.handleDateChange(date, 'startDate');
                }}
              />
              <div
                style={{
                  display: 'inline-block',
                  margin: '16px 15px 8px',
                  lineHeight: '48px',
                }}
              >
                {' '}
                ~{' '}
              </div>
              <DatePicker
                autoOk={true}
                disableToolbar
                variant="inline"
                format="YYYY/MM/DD"
                margin="normal"
                id="date-picker-inline"
                label="검색 종료일"
                value={endDate}
                onChange={(date) => {
                  this.handleDateChange(date, 'endDate');
                }}
              />
            </MuiPickersUtilsProvider>
            <IconButton type="button" onClick={this.fetchFile}>
              <DescriptionIcon fontSize="large" />
            </IconButton>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
