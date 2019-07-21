import { StyledButton } from "../Styles/StyledCom";
import "../Styles/Home.scss";
import Answer from "./Answer";
import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Pagination from "./Pagination";
import { connect } from "react-redux";
import * as actionCreator from "../Store/Actions/questionAction";
import { setLoader } from "../Store/Actions/loginAction";
const moment = require("moment");
const Cookie = require("js-cookie");

const Admin = props => {
  const [q, setQ] = useState(undefined);
  const [Sans, setSA] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(3);
  const getQs = async () => {
    const resp = await fetch("/file/getNotAnswered");
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

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = props.questions.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = pageNumber => setCurrentPage(pageNumber);

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
      <div id="pending">
        {props.questions.length === 0 && <h5>No pending Questions.</h5>}
      </div>

      {currentPosts.map((question, questionIndex) => {
        var ago = moment(question.askedOn).fromNow();
        var originalString = question.question;
        var modifiedString =
          originalString.length > 20
            ? originalString.substr(0, 20) + "....."
            : originalString;
        //(e.target.innerHTML = originalString)
        let temp = modifiedString;
        return (
          <div id="Qs">
            <div id="qtext">
              <h5
                onClick={e => {
                  e.target.innerHTML === originalString
                    ? (e.target.innerHTML = modifiedString)
                    : (e.target.innerHTML = originalString);

                  temp = e.target.innerHTML;
                }}
              >
                <div class="alert alert-info" role="alert">
                  <h5 id="mdfd">{temp}</h5>
                </div>
              </h5>
            </div>
            <p>({ago})</p>
            {question.attachment && (
              <>
                <img
                  id="img"
                  src={question.attachment}
                  usemap="m1"
                  alt="No Image added."
                />
                <br />
                <a href="#" onClick={() => window.open(question.attachment)}>
                  Download Image
                </a>
                <br />
                <br />
              </>
            )}
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
