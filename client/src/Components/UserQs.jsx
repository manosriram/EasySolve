import * as actionCreator from "../Store/Actions/questionAction";
import { connect } from "react-redux";
import React, { useEffect } from "react";
import Navbar from "./Navbar";
import { postHandler } from "../Headers";
import "../Styles/Home.scss";
import { setLoader } from "../Store/Actions/loginAction";

const UserQs = props => {
  const getQs = async email => {
    const resp = await fetch("/file/getUserQuestions", {
      method: postHandler.method,
      headers: postHandler.headers,
      body: JSON.stringify({ user: email })
    });
    const data = await resp.json();
    props.setQuestions(data);
    props.setLoader(false);
  };

  const getStatus = async () => {
    props.setLoader(true);
    const resp = await fetch("/auth/userInfo");
    const data = await resp.json();
    props.setUser(data.email);

    getQs(data.email);
  };

  useEffect(() => {
    getStatus();
    getQs();
  }, []);

  if (props.isSpinning) {
    return (
      <div class="d-flex justify-content-center" id="spinner">
        <div class="spinner-border" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <br />
      <br />
      <br />
      <div id="Qs">
        {props.questions.map((question, questionIndex) => {
          return (
            <>
              <h5>{question.question}</h5>
              <img
                key={questionIndex}
                src={question.attachment}
                alt="Image Not Found.."
              />
            </>
          );
        })}
      </div>
    </>
  );
};

const mapStateToProps = state => {
  return {
    user: state.Qs.user,
    questions: state.Qs.questions,
    isSpinning: state.Log.isSpinning
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setUser: em => dispatch(actionCreator.setUser(em)),
    setQuestions: qs => dispatch(actionCreator.setQs(qs)),
    setLoader: com => dispatch(setLoader(com))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserQs);
