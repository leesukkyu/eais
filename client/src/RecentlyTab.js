import React from 'react';

import axios from 'axios';

import Modal from '@material-ui/core/Modal';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import { ArrowDropDownOutlined } from '@material-ui/icons';
import NativeSelect from '@material-ui/core/NativeSelect';

import moment from 'moment';
import styled from 'styled-components';
import { SIDO_CODE_URL, SIDO_CODE_KEY, SIGOON_CODE_URL, SIGOON_CODE_KEY, SERVER_URL } from './public/CONFIG';

moment.locale('ko', {
  weekdays: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
  weekdaysShort: ['일', '월', '화', '수', '목', '금', '토'],
});

const SearchBtn = styled.button`
  color: ${(props) => (props.active ? '#db7093' : '#000000de')};
  font-size: 1em;
  border: none;
  cursor: pointer;
`;

class RecentlyTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sidoCode: '',
      sidoList: [],
      sigoonCode: '',
      sigoonList: [],
      isModalOpen: false,
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
        nextPage: 1,
      },
      searchType: 'crtnDay',
    };

    this.onClickLoadBtn = this.onClickLoadBtn.bind(this);
  }

  componentDidMount() {
    this.onClickLoadBtn();
    this.$httpLoadSidoCodeList();
  }

  // 시/도 선택
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

  // 시/군 선택
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

  fetchSearchList() {
    let page;
    page = this.state.rs.nextPage;
    if (page) {
      this.setState({
        isLoading: true,
      });
      axios
        .get(`${SERVER_URL}/api/collection/${page}`, {
          params: {
            sigunguCd: this.state.sigoonCode,
            sortType: this.state.searchType,
          },
        })
        .then((rs) => {
          this.state.tableList = this.state.tableList.concat(rs.data.docs);
          this.setState({
            isLoading: false,
            rs: rs.data,
          });
        });
    }
  }

  // 검색하기 누른 경우
  onClickLoadBtn() {
    this.fetchSearchList();
  }

  onClickSortBtn(searchType) {
    this.setState(
      {
        sidoCode: '',
        sidoList: '',
        sigoonCode: '',
        sigoonList: '',
        isModalOpen: false,
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
          nextPage: 1,
        },
        searchType: searchType,
      },
      () => {
        this.fetchSearchList();
      },
    );
  }

  onClickModalOpenBtn(item) {
    console.log(this);
    console.log(item);
    this.setState({
      isModalOpen: true,
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
          this.setState(
            {
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
                nextPage: 1,
              },
            },
            () => {
              this.fetchSearchList();
            },
          );
        }
      },
    );
  };

  render() {
    const { tableList, isLoading, isModalOpen, searchType } = this.state;
    const { sidoCode, sidoList, sigoonCode, sigoonList } = this.state;
    const { hasNextPage } = this.state.rs;
    return (
      <React.Fragment>
        <div style={{ position: 'fixed', width: '100%', top: '48px', zIndex: 1 }}>
          {isLoading ? <LinearProgress variant="query" /> : null}
        </div>
        <TableContainer
          component={Paper}
          style={{
            maxHeight: '100%',
            width: '100%',
            boxSizing: 'border-box',
            padding: '0',
          }}
        >
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
                marginRight: '10px',
              }}
              value={sigoonCode}
              onChange={(e) => {
                this.handleChange('sigoonCode', e);
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
          </div>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>대지위치</TableCell>
                <TableCell>건물명</TableCell>
                <TableCell>특수지명</TableCell>

                <TableCell>지목코드명</TableCell>
                <TableCell>지역코드명</TableCell>
                <TableCell>지구코드명</TableCell>

                <TableCell>대지면적(㎡)</TableCell>
                <TableCell>건축면적(㎡)</TableCell>
                <TableCell>건폐율(%)</TableCell>
                <TableCell>연면적(㎡)</TableCell>

                <TableCell>착공예정일</TableCell>
                <TableCell>착공연기일</TableCell>
                <TableCell>실제착공일</TableCell>
                <TableCell>
                  <SearchBtn
                    type="button"
                    active={searchType === 'archPmsDay'}
                    onClick={() => {
                      this.onClickSortBtn('archPmsDay');
                    }}
                  >
                    건축허가일
                    <ArrowDropDownOutlined></ArrowDropDownOutlined>
                  </SearchBtn>
                </TableCell>
                <TableCell>사용승인일</TableCell>
                <TableCell>
                  <SearchBtn
                    type="button"
                    active={searchType === 'crtnDay'}
                    onClick={() => {
                      this.onClickSortBtn('crtnDay');
                    }}
                  >
                    생성일자
                    <ArrowDropDownOutlined></ArrowDropDownOutlined>
                  </SearchBtn>
                </TableCell>

                <TableCell>수집일</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableList.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.platPlc}</TableCell>
                  <TableCell>{item.bldNm}</TableCell>
                  <TableCell>{item.splotNm}</TableCell>

                  <TableCell>{item.jimokCdNm}</TableCell>
                  <TableCell>{item.jiyukCdNm}</TableCell>
                  <TableCell>{item.jiguCdNm}</TableCell>

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

                  <TableCell>{moment(item.time).format('YYYYMMDD')}</TableCell>
                  <TableCell>
                    <Button color="secondary" onClick={this.onClickModalOpenBtn.bind(this, item)}>
                      <Icon>zoom_in</Icon>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan="21">
                  {hasNextPage === false ? (
                    <div>더이상 수집 데이터가 없습니다</div>
                  ) : (
                    <Button color="secondary" onClick={this.onClickLoadBtn}>
                      <Icon>add_box</Icon>
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>

        <Modal open={isModalOpen} onClose={this.onClickModalCloseBtn}>
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            style={{ height: '100%', overflow: 'auto', padding: '20px 0' }}
          >
            <Grid item xs={12} sm={6}>
              <Paper>상세보기 기능 준비</Paper>
            </Grid>
          </Grid>
        </Modal>
      </React.Fragment>
    );
  }
}

export default RecentlyTab;
