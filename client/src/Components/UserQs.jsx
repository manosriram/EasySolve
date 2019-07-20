import ImageZoom from "react-medium-image-zoom";
import * as actionCreator from "../Store/Actions/questionAction";
import { connect } from "react-redux";
import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { postHandler } from "../Headers";
import "../Styles/Home.scss";
import { setLoader } from "../Store/Actions/loginAction";
const moment = require("moment");

const UserQs = props => {
  const getQs = async username => {
    const resp = await fetch("/file/getUserQuestions", {
      method: postHandler.method,
      headers: postHandler.headers,
      body: JSON.stringify({ user: username })
    });
    const data = await resp.json();
    props.setQuestions(data);
  };

  const getStatus = async () => {
    props.setLoader(true);
    const resp = await fetch("/auth/userInfo");
    const data = await resp.json();
    props.setUser(data.email);
    getQs(data.username);
    props.setLoader(false);
  };

  useEffect(() => {
    getStatus();
    getQs();
  }, []);

  const toggleV = divIndex => {
    props.toggleVisibility();
    let els = document.querySelector(`#div${divIndex}`);
    let secR = document.querySelector(`#msg${divIndex}`);
    !props.toggleV
      ? (els.style.display = "block") &&
        (secR.style.display = "block") &&
        (secR.innerHTML = "Show Less")
      : (els.style.display = "none") && (secR.innerHTML = "Show Answer");
  };

  if (props.isSpinning) {
    return (
      <div className="d-flex justify-content-center" id="spinner">
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  } else {
    return (
      <>
        <Navbar props={props} />
        <br />
        <br />
        <div>
          {props.questions.length === 0 && <h4 id="Qs">No Questions yet.</h4>}
          {props.questions.map((question, questionIndex) => {
            var ago = moment(question.askedOn).fromNow();
            var originalString = question.question;
            var modifiedString =
              originalString.length > 20
                ? originalString.substr(0, 20) + "..."
                : originalString;
            return (
              <div id="Qs">
                <div id="qtext">
                  <h5 onClick={e => (e.target.innerHTML = originalString)}>
                    {modifiedString}
                  </h5>
                </div>
                <p>({ago})</p>
                {/* <ImageZoom
                  className="img"
                  image={{
                    src: question.attachment,
                    alt: "Not found.",
                    className: "img"
                  }}
                  zoomImage={{
                    src: question.attachment,
                    alt: "Not found.",
                    className: "img--zoomed"
                  }}
                /> */}
                <img id="img" src={question.attachment} alt="No Image added." />
                <br />
                <br />
                <br />
                {!question.isAnswered && (
                  <>
                    <h4>Not yet answered.</h4>
                  </>
                )}
                {question.isAnswered && (
                  <>
                    <h5
                      id={"msg" + questionIndex}
                      onClick={() => toggleV(questionIndex)}
                      className="showToggle"
                    >
                      Show Answer
                    </h5>
                    <div id={"div" + questionIndex} className="answerElement">
                      <>
                        <hr />
                        <img id="img" src={question.answer.attachment} />
                        <h4>{question.answer.answerString}</h4>
                        <p>
                          Answered by : <strong>{question.answeredBy}</strong>
                        </p>
                        <hr />
                      </>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </>
    );
  }
};

const mapStateToProps = state => {
  return {
    user: state.Qs.user,
    questions: state.Qs.questions,
    isSpinning: state.Log.isSpinning,
    toggleV: state.Qs.toggleV
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setUser: em => dispatch(actionCreator.setUser(em)),
    setQuestions: qs => dispatch(actionCreator.setQs(qs)),
    setLoader: com => dispatch(setLoader(com)),
    toggleVisibility: () => dispatch(actionCreator.toggleAnswerVisibility())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserQs);
