import React from "react";
import Navbar from "./Navbar";
import "../Styles/Home.scss";
import * as actionCreator from "../Store/Actions/questionAction";
import { connect } from "react-redux";
import ShowMoreText from "react-show-more-text";
import { Link } from "react-router-dom";
import { SSL_OP_NETSCAPE_CA_DN_BUG } from "constants";

const Answers = props => {
  const [answer, setAns] = React.useState([]);

  const deleteQuestion = async aID => {
    const resp = await fetch("/file/deleteAnswer", {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ aID, qID: props.qID })
    });
    document.location.reload();
  };

  const fetchData = async () => {
    const resp = await fetch("/file/getAllAnswers", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ qID: props.qID })
    });
    const data = await resp.json();
    data.success ? setAns(data.answers) : setAns([]);
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Navbar />
      <br />
      <br />
      {answer.map((ans, ansInd) => {
        return (
          <div id="Qs">
            <h5>
              Answered By <strong>{ans.answeredBy}</strong>
            </h5>
            <br />
            <div id="container">
              <img src={ans.attachment} id="img" alt="No Image added." />
            </div>
            <br />
            {ans.attachment && (
              <a href="#" onClick={() => window.open(ans.attachment)}>
                <strong>Download File</strong>
                &nbsp;&nbsp;
              </a>
            )}
            {ans.answeredEmail == props.email && (
              <Link id="delAns" onClick={() => deleteQuestion(ans._id)}>
                <strong> Delete Answer.</strong>
              </Link>
            )}
            <div id="ans" class="alert alert-info" role="alert">
              <ShowMoreText lines={3} more="Show more" less="Show less">
                <div id="textA">{ans.answerString}</div>
              </ShowMoreText>
            </div>
            <hr />
          </div>
        );
      })}
    </>
  );
};

const mapStateToProps = state => {
  return {
    __id: state.Qs.current_ID
  };
};

const mapDispatchToProps = dispatch => {
  return {
    gotoANS: q_id => dispatch(actionCreator.gotoA(q_id))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Answers);
