import Pagination from "./Pagination";
import * as actionCreator from "../Store/Actions/questionAction";
import { connect } from "react-redux";
import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { postHandler } from "../Headers";
import ShowMoreText from "react-show-more-text";
import "../Styles/Home.scss";
import { Link } from "react-router-dom";
import { setLoader } from "../Store/Actions/loginAction";
import Answers from "./Answers";
const moment = require("moment");

const UserQs = props => {
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(3);
  const [showAns, setShowAns] = useState(false);
  const [qid, set_q_id] = useState("");
  const [isSpinning, setSpinner] = React.useState(true);

  const getQs = async username => {
    const resp = await fetch("/file/getUserQuestions", {
      method: postHandler.method,
      headers: postHandler.headers,
      body: JSON.stringify({ user: username })
    });
    const data = await resp.json();
    await props.setQuestions(data);
    setSpinner(false);
  };

  const getStatus = async () => {
    props.setLoader(true);
    const resp = await fetch("/auth/userInfo");
    const data = await resp.json();
    await props.setUser(data.email);
    getQs(data.username);
  };

  const deleteQuestion = async qID => {
    const resp = await fetch("/file/deleteQuestion", {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ qID })
    });
    document.location.reload();
  };

  useEffect(() => {
    getStatus();
    getQs();
  }, []);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = props.questions.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  const showAnswers = _id => {
    setShowAns(true);
    set_q_id(_id);
  };

  if (showAns) {
    return <Answers qID={qid} />;
  }

  if (isSpinning) {
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
        <div>
          {props.questions.length === 0 && <h4 id="Qs">No Questions yet.</h4>}
          {currentPosts.map((question, questionIndex) => {
            var ago = moment(question.askedOn).fromNow();
            return (
              <div id="Qs" key={questionIndex}>
                <div id="qtext" key={questionIndex}>
                  <div className="alert alert-info" role="alert">
                    <ShowMoreText
                      lines={3}
                      more="Show more"
                      less="Show less"
                      id="ta"
                    >
                      <div id="textA">{question.question}</div>
                      <br />
                    </ShowMoreText>
                  </div>
                </div>
                <p>({ago})</p>
                {question.attachment && (
                  <>
                    <img
                      id="img"
                      src={question.attachment}
                      alt="No Image added."
                    />
                    <br />
                    <a
                      href="#"
                      onClick={() => window.open(question.attachment)}
                    >
                      Download File
                    </a>
                    &nbsp;&nbsp;&nbsp;
                    <br />
                    <br />
                  </>
                )}
                {!question.isAnswered && (
                  <>
                    <h4>Not yet answered.</h4>
                  </>
                )}
                <img
                  onClick={() => deleteQuestion(question._id)}
                  id="delete"
                  src="https://img.icons8.com/flat_round/40/000000/delete-sign.png"
                />
                <br />
                <br />
                {question.isAnswered && (
                  <>
                    <Link onClick={() => showAnswers(question._id)}>
                      Show Answers
                    </Link>
                  </>
                )}
              </div>
            );
          })}
        </div>
        <br />
        <br />
        <div id="paginate">
          <Pagination
            postsPerPage={postsPerPage}
            totalPosts={props.questions.length}
            paginate={paginate}
          />
        </div>
        <div className="footerElse">
          <a id="anc">Your Questions.</a>
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
