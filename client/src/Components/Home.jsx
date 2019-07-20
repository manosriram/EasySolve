import React, { useEffect } from "react";
import Navbar from "./Navbar";
import { connect } from "react-redux";
import { setLoader } from "../Store/Actions/loginAction";
import * as actionCreator from "../Store/Actions/questionAction";
import { StyledButton, StyledInput } from "../Styles/StyledCom";
import "../Styles/Home.scss";

const Home = props => {
  const [username, setUsername] = React.useState("");
  const getStatus = async () => {
    const resp = await fetch("/auth/userInfo");
    const data = await resp.json();
    setUsername(data.username);
  };
  useEffect(() => {
    getStatus();
  }, []);

  const preSubmitHandler = e => {
    e.preventDefault();

    if (props.question && !props.attachment) {
      let formData = new FormData();
      formData.append("question", props.question);
      formData.append("user", username);
      props.submitData(e, formData);
      return;
    }
    if (props.attachment || props.question) {
      let formData = new FormData();
      formData.append("imageFile", props.attachment[0]);
      formData.append("question", props.question);
      formData.append("user", username);
      formData.set("enctype", "multipart/form-data");
      props.submitData(e, formData);
      return;
    } else {
      props.setMessage("Fill all the fields..");
      return;
    }
  };

  return (
    <>
      <Navbar props={props} username={username} />
      <br />
      <br />
      <div id="message">
        <h2>Welcome {username}</h2>
        <br />
        <br />
        <h3>{props.message}</h3>
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
        <br />
        <StyledInput
          name="imageFile"
          type="file"
          borderC="transparent"
          onChange={props.handleFileChange}
        />
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
    setMessage: msg => dispatch(actionCreator.setMessage(msg))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
