import React, { useEffect } from "react";
import { StyledInput, StyledButton } from "../Styles/StyledCom";
import { connect } from "react-redux";
import * as actionCreator from "../Store/Actions/loginAction";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Home from "./Home";

const Login = props => {
  const setUserStatus = async () => {
    const resp = await fetch("/auth/isLoggedIn");
    const data = await resp.json();
    props.setLoginStatus(data.loggedIn);
  };

  useEffect(() => {
    props.setLoader(true);
    setUserStatus();
  }, []);

  const handleChange = e => {
    props.handleChange(e);
  };

  const handleSubmit = e => {
    var data = {
      email: props.email,
      password: props.password
    };
    props.setLoader(true);
    props.handleSubmit(e, data);
  };

  if (props.isSpinning) {
    return (
      <div class="d-flex justify-content-center" id="spinner">
        <div class="spinner-border" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    );
  } else {
    if (props.loggedInStatus) {
      return props.history.push("/home");
    }

    return (
      <div id="intro">
        <Navbar isLoggedIn={props.loggedInStatus} />
        <br />
        <br />
        <h3>{props.message}</h3>
        <div id="LoginForm" onChange={handleChange}>
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
          <p>
            Not Registered ? <Link to="/register">Create an Account</Link>
          </p>
        </div>
      </div>
    );
  }
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
    setLoginStatus: com => dispatch(actionCreator.setLoginStatus(com))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
