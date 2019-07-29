import React, { useEffect } from "react";
import Navbar from "./Navbar";
import { connect } from "react-redux";
import { setLoader } from "../Store/Actions/loginAction";
import * as actionCreator from "../Store/Actions/questionAction";
import { StyledButton, StyledInput } from "../Styles/StyledCom";
import "../Styles/Home.scss";

const Home = props => {
  const [username, setUsername] = React.useState("");
  const [isSpinning, setSpinner] = React.useState(true);

  const getStatus = async () => {
    const resp = await fetch("/auth/userInfo");
    const data = await resp.json();
    setUsername(data.username);
    setSpinner(false);
  };

  useEffect(() => {
    props.rstP();
    props.setMessage("");
    getStatus();
  }, []);

  const removeAtt = () => {
    props.removeAtt();
  };

  const preSubmitHandler = e => {
    e.preventDefault();
    if (props.question && !props.attachment) {
      let formData = new FormData();
      formData.append("question", props.question);
      formData.append("user", username);
      props.submitData(e, formData);
    } else if (props.attachment || props.question) {
      let formData = new FormData();
      formData.append("image", props.attachment[0]);
      formData.append("question", props.question);
      formData.append("user", username);
      formData.set("method", "post");
      formData.append("enctype", "multipart/form-data");
      props.submitData(e, formData);
    } else {
      props.setMessage("Fill all the fields..");
    }
    return;
  };

  if (isSpinning) {
    return (
      <div className="d-flex justify-content-center" id="spinner">
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar props={props} username={username} />
      <br />
      <br />
      <div id="message">
        <h2>Welcome {username}</h2>
        <br />
        <h3>{props.message}</h3>
        <br />
      </div>
      <form id="questionArea">
        <textarea
          name="question"
          id="qstn"
          cols="100"
          rows="8"
          placeholder="Your Question Here.."
          onChange={props.handleChange}
        />
        <StyledInput
          name="image"
          type="file"
          id="files"
          borderC="transparent"
          onChange={props.handleFileChange}
          hidden
        />
        <br />
        <br />
        <label
          itemType="file"
          for="files"
          id="fle"
          onChange={props.handleFileChange}
        >
          Select file
        </label>
        <br />
        {props.attachment && (
          <>
            {props.attachment[0].name}
            &nbsp;&nbsp;&nbsp;
            <img
              onClick={removeAtt}
              id="delete"
              src="https://img.icons8.com/flat_round/40/000000/delete-sign.png"
            />
          </>
        )}
        <br />
        <br />
        <StyledButton id="ask" onClick={preSubmitHandler}>
          Ask
        </StyledButton>
      </form>
    </>
  );
};

const mapStateToProps = state => {
  return {
    isSpinning: state.Log.isSpinning,
    question: state.Qs.question,
    attachment: state.Qs.attachment,
    user: state.Qs.user,
    message: state.Qs.message
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setLoader: com => dispatch(setLoader(com)),
    handleChange: e => dispatch(actionCreator.handleChange(e)),
    handleFileChange: e => dispatch(actionCreator.handleFileChange(e)),
    submitData: (e, data) => dispatch(actionCreator.submitData(e, data)),
    setUser: user => dispatch(actionCreator.setUser(user)),
    setMessage: msg => dispatch(actionCreator.setMessage(msg)),
    rstP: () => dispatch(actionCreator.resetProps()),
    removeAtt: () => dispatch(actionCreator.removeAtt())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
