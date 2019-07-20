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
  const [msg, setMsg] = useState("");

  useEffect(() => {
    props.setMessage("");
    if (Cookie.get("adTk")) {
      setStatus(true);
    }
  }, []);

  const handleSubmit = async e => {
    var data = {
      email: props.email,
      password: props.password
    };
    props.setLoader(true);
    const resp = await fetch("/auth/adminRegister", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email: data.email, password: data.password })
    });
    const respData = await resp.json();
    setMsg(respData.errMessage);
    console.log(respData);
  };

  if (status) {
    return <Admin />;
  }

  return (
    <>
      <Navbar props={props} />
      <br />
      {/* <div id="LoginForm" onChange={e => props.handleChange(e)}>
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
      </div> */}
      <div id="midMSG">
        <h3>{msg}</h3>
      </div>
      <div id="LoginForm" onChange={e => props.handleChange(e)}>
        <p>Register here..</p>
        <h4>{props.message}</h4>
        <br />
        <StyledInput type="email" placeholder="Email Address" name="email" />
        <br />
        <br />
        <StyledInput type="password" placeholder="Password" name="password" />
        <br />
        <br />
        <StyledButton onClick={handleSubmit}>Register</StyledButton>
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
