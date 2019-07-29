import { StyledButton } from "../Styles/StyledCom";
import "../Styles/Home.scss";
import Answer from "./Answer";
import React, { useEffect, useState } from "react";
import ShowMoreText from "react-show-more-text";
import Navbar from "./Navbar";
import Pagination from "./Pagination";
import { connect } from "react-redux";
import * as actionCreator from "../Store/Actions/questionAction";
import { setLoader } from "../Store/Actions/loginAction";
import { Link } from "react-router-dom";
import Answers from "./Answers";
const moment = require("moment");
const Cookie = require("js-cookie");

const Admin = props => {
  const [isSpinning, setSpinner] = React.useState(true);
  const [q, setQ] = useState(undefined);
  const [Sans, setSA] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(3);
  const [showAns, setShowAns] = useState(false);
  const [qid, set_q_id] = useState(undefined);
  const [adEm, setAdm] = useState("");
  const [lgSt, setLgSt] = useState(false);

  const getQs = async () => {
    const resp = await fetch("/file/getAllQuestions");
    const data = await resp.json();
    props.setQuestions(data);
    setSpinner(false);
  };

  useEffect(() => {
    const fetchAdmin = async () => {
      const resp = await fetch("/auth/getAdminDet");
      const data = await resp.json();
      if (data.success) {
        setAdm(data.email);
        setLgSt(true);
      } else {
        setLgSt(false);
      }
    };
    fetchAdmin();
    getQs();
  }, []);

  const showAnswers = _id => {
    setShowAns(true);
    set_q_id(_id);
  };

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

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = props.questions.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  if (isSpinning) {
    return (
      <div className="d-flex justify-content-center" id="spinner">
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (!lgSt) {
    return (
      <div id="pending">
        <h6>No Access.Login as Admin to continue..</h6>
      </div>
    );
  }

  if (Sans) {
    return (
      <Answer
        adminEmail={adEm}
        question={q.question}
        id={q.id}
        attachment={q.attachment}
        props={props}
      />
    );
  }

  if (showAns) {
    return <Answers qID={qid} email={adEm} />;
  }

  return (
    <>
      <Navbar props={props} />
      <br />
      <div>
        <h5 id="pending">Welcome {adEm}</h5>
      </div>
      <hr />
      <div id="pending">
        {props.questions.length === 0 && <h5>No pending Questions.</h5>}
      </div>

      {currentPosts.map((question, questionIndex) => {
        var ago = moment(question.askedOn).fromNow();
        return (
          <div id="Qs" key={questionIndex}>
            <div id="qtext" key={questionIndex}>
              {question.question && (
                <div className="alert alert-info" role="alert" id="ans">
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
              )}
              <p>Asked by ({question.askedBy})</p>
            </div>
            <p>
              ({ago}) -> {question.answer.length}
              {question.answer.length === 1 && " answer."}
              {question.answer.length != 1 && " answers."}
            </p>
            {question.attachment && (
              <>
                <img id="img" src={question.attachment} alt="No Image added." />
                <br />
                <a href="#" onClick={() => window.open(question.attachment)}>
                  Download File
                </a>
                &nbsp;&nbsp;&nbsp;
              </>
            )}
            {question.isAnswered && (
              <>
                <Link onClick={() => showAnswers(question._id)}>
                  Show Answers
                </Link>
              </>
            )}
            <br />
            <br />
            <StyledButton onClick={() => handlePopUp(question)}>
              Answer
            </StyledButton>
            <br />
            <br />
          </div>
        );
      })}

      <div id="paginate">
        <Pagination
          postsPerPage={postsPerPage}
          totalPosts={props.questions.length}
          paginate={paginate}
        />
      </div>
      <div className="footer">
        <a id="anc" onClick={adminLogout}>
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
