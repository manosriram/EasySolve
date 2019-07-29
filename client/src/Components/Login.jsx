import React, { useEffect } from "react";
import { StyledInput, StyledButton } from "../Styles/StyledCom";
import { connect } from "react-redux";
import * as actionCreator from "../Store/Actions/loginAction";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import "../Styles/Auth.scss";

const Login = props => {
  const [isSpinning, setSpinner] = React.useState(true);
  const setUserStatus = async () => {
    const resp = await fetch("/auth/isLoggedIn");
    const data = await resp.json();
    props.setLoginStatus(data.loggedIn);
  };

  useEffect(() => {
    setUserStatus();
    setSpinner(false);
  }, []);

  const handleChange = e => {
    props.handleChange(e);
  };

  const handleSubmit = e => {
    setSpinner(true);
    var data = {
      email: props.email,
      password: props.password
    };
    props.handleSubmit(e, data);
    setSpinner(false);
  };

  if (props.loggedInStatus) {
    props.history.push("/home");
  }

  if (isSpinning) {
    return (
      <div className="d-flex justify-content-center" id="spinner">
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div id="intro">
        <Navbar props={props} />
        <div id="LoginForm" onChange={handleChange}>
          <br />
          <h3>{props.message}</h3>
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
      <div className="footerElse">
        <a id="anc">Login Page.</a>
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
    setLoginStatus: com => dispatch(actionCreator.setLoginStatus(com))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
