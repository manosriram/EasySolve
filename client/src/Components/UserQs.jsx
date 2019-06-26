import ImageZoom from "react-medium-image-zoom";
import * as actionCreator from "../Store/Actions/questionAction";
import { connect } from "react-redux";
import React, { useEffect } from "react";
import Navbar from "./Navbar";
import { postHandler } from "../Headers";
import "../Styles/Home.scss";
import { setLoader } from "../Store/Actions/loginAction";
const moment = require("moment");

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

  // const downloadImage = async path => {
  //   try {
  //     const resp = await fetch("/file/downloadFile", {
  //       method: postHandler.method,
  //       headers: postHandler.headers,
  //       body: JSON.stringify({ path })
  //     });
  //     const data = await resp.json();
  //     console.log(data);
  //   } catch (er) {
  //     console.log(er);
  //   }
  // };

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
        <Navbar />
        <br />
        <br />
        <br />
        <div>
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

                {!question.isAnswered && <h4>Not yet answered.</h4>}

                {question.isAnswered && (
                  <>
                    <hr />
                    <img id="img" src={question.answer.attachment} />
                    <h4>{question.answer.answerString}</h4>
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
