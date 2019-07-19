import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import "../Styles/Auth.scss";
import { StyledInput, StyledButton } from "../Styles/StyledCom";
import { connect } from "react-redux";
import Admin from "./Admin";
import * as actionCreator from "../Store/Actions/loginAction";
const Cookie = require("js-cookie");

const AdminPanel = props => {
  const [status, setStatus] = useState(false);

  useEffect(() => {
    props.setMessage("");
    if (Cookie.get("adTk")) {
      setStatus(true);
    }
  }, []);

  const handleSubmit = e => {
    var data = {
      email: props.email,
      password: props.password
    };
    props.setLoader(true);
    // props.handleSubmit(e, data);
    if (
      data.email === "easysolve.co.in@gmail.com" &&
      data.password === "Easysolve@2019"
    ) {
      Cookie.set("adTk", true);
      setStatus(true);
      // props.setLoginStatus(true);
    } else {
      props.setMessage("Wrong Information..");
    }
  };

  if (status) {
    return <Admin />;
  }

  return (
    <>
      <Navbar props={props} />
      <br />
      <div id="LoginForm" onChange={e => props.handleChange(e)}>
        <h4>{props.message}</h4>
        <br />
        <StyledInput type="email" placeholder="Email Address" name="email" />
        <br />
        <br />
        <StyledInput type="password" placeholder="Password" name="password" />
        <br />
        <br />
        <StyledButton onClick={handleSubmit}>Login</StyledButton>
        <br />
        <br />
      </div>
    </>
  );
};
const mapStateToProps = state => {
  return {
    email: state.Log.email,
    password: state.Log.password,
    isSpinning: state.Log.isSpinning,
    message: state.Log.message,
    loggedInStatus: state.Log.loggedInStatus
  };
};

const mapDispatchToProps = dispatch => {
  return {
    handleChange: e => dispatch(actionCreator.handleChange(e)),
    setLoader: com => dispatch(actionCreator.setLoader(com)),
    handleSubmit: (e, data) => dispatch(actionCreator.handleSubmit(e, data)),
    setLoginStatus: com => dispatch(actionCreator.setLoginStatus(com)),
    setMessage: msg => dispatch(actionCreator.setMessage(msg))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdminPanel);
