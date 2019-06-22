import React, { useState, useEffect } from "react";
import "../Styles/Index.scss";
import Navbar from "./Navbar";
import { connect } from "react-redux";
import * as actionCreator from "../Store/Actions/loginAction";
import Home from "./Home";

const Index = props => {
  const setUserStatus = async () => {
    const resp = await fetch("/auth/isLoggedIn");
    const data = await resp.json();
    props.setLoginStatus(data.loggedIn);
  };

  useEffect(() => {
    props.setLoader(true);
    setUserStatus();
  }, []);

  if (props.loggedInStatus) {
    return <Home isLoggedIn={props.loggedInStatus} />;
  } else {
    return (
      <div id="intro">
        <Navbar isLoggedIn={props.loggedInStatus} />
        <h1>Easy Solve !</h1>
        <br />
        <h3>You Ask, We Answer !</h3>
        <br />
        <h4>Login or Register to Continue....</h4>
      </div>
    );
  }
};

const mapStateToProps = state => {
  return {
    isSpinning: state.Log.isSpinning,
    loggedInStatus: state.Log.loggedInStatus
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setLoader: com => dispatch(actionCreator.setLoader(com)),
    setLoginStatus: com => dispatch(actionCreator.setLoginStatus(com))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Index);
