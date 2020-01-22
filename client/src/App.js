import React from "react";

import { makeStyles } from "@material-ui/core/styles";

import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

import RecentlyTab from "./RecentlyTab";
import SearchTab from "./SearchTab";

const useStyles = makeStyles({
  tabPanel: {
    height: "calc(100% - 48px)"
  }
});

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3} className="full-height" style={{ padding: 0 }}>
          {children}
        </Box>
      )}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

export default function SimpleTabs() {
  const [value, setValue] = React.useState(0);
  const classes = useStyles();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <React.Fragment>
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange}>
          <Tab label="지역 검색하기" />
          <Tab label="전국 최신 데이터 보기" />
        </Tabs>
      </AppBar>
      <TabPanel className={classes.tabPanel} value={value} index={0}>
        <SearchTab></SearchTab>
      </TabPanel>
      <TabPanel className={classes.tabPanel} value={value} index={1}>
        <RecentlyTab></RecentlyTab>
      </TabPanel>
    </React.Fragment>
  );
}
