import React from "react";
import Navbar from "./Navbar";
import "../Styles/Home.scss";
import * as actionCreator from "../Store/Actions/questionAction";
import { connect } from "react-redux";

const Answers = props => {
  const [answer, setAns] = React.useState([]);
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
    console.log(data);
    data.success ? setAns(data.answers) : setAns([]);
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Navbar />
      {answer.map((ans, ansInd) => {
        return (
          <div id="Qs">
            <br />
            <div class="alert alert-info" role="alert">
              <h5>
                {ans.answerString} <strong>(Answer by {ans.answeredBy})</strong>{" "}
              </h5>
            </div>
            <br />
            <br />
            {ans.attachment && <img src={ans.attachment} id="img" />}
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
