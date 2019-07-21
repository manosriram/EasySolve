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
    data.success ? setAns(data.answers) : setAns([]);
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Navbar />
      {answer.map((ans, ansInd) => {
        var originalString = ans.answerString;
        var modifiedString =
          originalString.length > 20
            ? originalString.substr(0, 20) + "....."
            : originalString;
        var temp = modifiedString;
        return (
          <div id="Qs">
            <h5>
              Answered By <strong>{ans.answeredBy}</strong>
            </h5>
            <br />
            <img src={ans.attachment} id="img" alt="No Image added." />
            <br />
            <div
              id="ans"
              class="alert alert-info"
              role="alert"
              onClick={e => {
                temp === ans.answerString
                  ? (temp = modifiedString)
                  : (temp = ans.answerString);

                e.target.innerHTML = temp;
              }}
            >
              <h5>{temp}</h5>
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
