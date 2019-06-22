import React, { useEffect } from "react";
import Navbar from "./Navbar";
import { connect } from "react-redux";
import { setLoader } from "../Store/Actions/loginAction";
import * as actionCreator from "../Store/Actions/questionAction";
import { StyledButton, StyledInput } from "../Styles/StyledCom";
import "../Styles/Home.scss";
import * as logActionCreator from "../Store/Actions/loginAction";

const Home = props => {
  const getStatus = async () => {
    const resp = await fetch("/auth/isLoggedIn");
    const data = await resp.json();
    props.setLoginStatus(data.loggedIn);
  };
  useEffect(() => {
    getStatus();
    console.log(props);
  }, []);

  const preSubmitHandler = e => {
    const data = {
      question: props.question,
      attachment: props.attachment,
      user: props.user
    };

    props.submitData(e, data);
  };

  return (
    <>
      <Navbar isLoggedIn={props.isLoggedIn} />
      <div id="questionArea">
        <textarea
          name="question"
          id="qstn"
          cols="100"
          rows="8"
          placeholder="Your Question Here.."
          onChange={props.handleChange}
        />
        <br />
        <StyledInput
          type="file"
          borderC="transparent"
          onChange={props.handleFileChange}
          name="attachment"
        />
        <br />
        <br />
        <StyledButton onClick={preSubmitHandler}>Ask</StyledButton>
      </div>
    </>
  );
};

const mapStateToProps = state => {
  return {
    isSpinning: state.Log.isSpinning,
    question: state.Qs.question,
    attachment: state.Qs.attachment,
    user: state.Qs.user
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setLoader: com => dispatch(setLoader(com)),
    handleChange: e => dispatch(actionCreator.handleChange(e)),
    handleFileChange: e => dispatch(actionCreator.handleFileChange(e)),
    submitData: (e, data) => dispatch(actionCreator.submitData(e, data)),
    setLoginStatus: com => dispatch(logActionCreator.setLoginStatus(com))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
