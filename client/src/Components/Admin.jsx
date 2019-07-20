import { StyledButton } from "../Styles/StyledCom";
import "../Styles/Home.scss";
import Answer from "./Answer";
import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { connect } from "react-redux";
import * as actionCreator from "../Store/Actions/questionAction";
import { setLoader } from "../Store/Actions/loginAction";
const moment = require("moment");
const Cookie = require("js-cookie");

const Admin = props => {
  const [q, setQ] = useState(undefined);
  const [Sans, setSA] = useState(false);
  const getQs = async () => {
    const resp = await fetch("/file/getAllQuestions");
    const data = await resp.json();
    props.setQuestions(data);
    props.setLoader(false);
  };

  useEffect(() => {
    getQs();
  }, []);

  const adminLogout = () => {
    Cookie.remove("admin_t_auth");
    window.location = "/adminPanel";
  };

  const handlePopUp = question => {
    setQ({
      question: question.question,
      id: question._id,
      attachment: question.attachment
    });
    setSA(true);
  };

  if (Sans) {
    return (
      <Answer
        question={q.question}
        id={q.id}
        attachment={q.attachment}
        props={props}
      />
    );
  }
  var cn = 0;
  return (
    <>
      <Navbar props={props} />
      <br />
      {props.questions.map((question, questionIndex) => {
        var ago = moment(question.askedOn).fromNow();
        var originalString = question.question;
        var modifiedString =
          originalString.length > 20
            ? originalString.substr(0, 20) + "..."
            : originalString;

        if (!question.isAnswered) {
          cn++;
          return (
            <div id="Qs">
              <div id="qtext">
                <h5 onClick={e => (e.target.innerHTML = originalString)}>
                  {modifiedString}
                </h5>
                <p>( asked by {question.askedBy} )</p>
              </div>
              <p>({ago})</p>
              {question.attachment && (
                <img id="img" src={question.attachment} alt="No Image added." />
              )}
              <br />
              <br />
              <StyledButton onClick={() => handlePopUp(question)}>
                Answer
              </StyledButton>
            </div>
          );
        }
      })}
      <div id="pending">
        {!cn && (
          <>
            <h5>No pending Questions.</h5>
            <a href="#" onClick={adminLogout}>
              Logout
            </a>
          </>
        )}
        <a href="#" id="lgot" onClick={adminLogout}>
          Admin Logout
        </a>
      </div>
    </>
  );
};

const mapStateToProps = state => {
  return {
    questions: state.Qs.questions,
    isSpinning: state.Log.isSpinning,
    answerQuestion: state.Qs.answerQuestion
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setQuestions: qs => dispatch(actionCreator.setQs(qs)),
    setLoader: com => dispatch(setLoader(com)),
    answerQuestion: () => dispatch(actionCreator.setQA())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Admin);
