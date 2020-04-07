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

import { SERVER_URL } from './public/CONFIG';

moment.locale('ko');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      startDate: new Date(),
      endDate: new Date(),
      type: 'crtnDay',
    };
  }

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
    const type = this.state.type;
    const startDate = moment(this.state.startDate).format('YYYYMMDD');
    const endDate = moment(this.state.endDate).format('YYYYMMDD');
    window.open(`http://localhost:5500/api/filedownload?type=${type}&startDate=${startDate}&endDate=${endDate}`);
  };

  render() {
    const { isLoading, startDate, endDate, type } = this.state;
    return (
      <div>
        <div style={{ position: 'fixed', width: '100%', top: '48px', zIndex: 1 }}>
          {isLoading ? <LinearProgress variant="query" /> : null}
        </div>
        <div style={{ padding: '25px' }}>
          <div style={{ margin: '10px' }}>
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
