import React, { useEffect } from "react";
import "../Styles/Index.scss";
import Navbar from "./Navbar";
import { connect } from "react-redux";
import * as actionCreator from "../Store/Actions/loginAction";
import Home from "./Home";
import { Link } from "react-router-dom";

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
      <>
        <div id="intro">
          <Navbar props={props} />
          <div id="index">
            <h1>Easy Solve !</h1>
            <br />
            <h3>You Ask, We Answer !</h3>
            <br />
            <h4>
              <Link to="/login" id="lnk">
                Login
              </Link>{" "}
              or{" "}
              <Link to="/register" id="lnk">
                Register
              </Link>{" "}
              to get started...
            </h4>
          </div>
        </div>
        <div className="footerElse">
          <a id="anc">Easy Solve</a>
        </div>
      </>
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
