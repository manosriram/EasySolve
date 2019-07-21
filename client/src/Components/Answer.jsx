import Navbar from "./Navbar";
import "../Styles/Auth.scss";
import React, { useEffect, useState } from "react";
import { StyledInput, StyledButton } from "../Styles/StyledCom";
const axios = require("axios");

var originalString;
var modifiedString;
var temp;
const Answer = ({ question, id, attachment }, props) => {
  useEffect(() => {
    originalString = question;
    modifiedString =
      originalString.length > 20
        ? originalString.substr(0, 20) + "..."
        : originalString;

    temp = modifiedString;
  }, []);

  const [userData, setUserData] = useState({});
  const [message, setMessage] = useState("");

  const confirmChecks = e => {
    e.preventDefault();
    if (!userData.username || userData.username.length < 4) {
      setMessage("Username too small, Min. 4 chars");
    } else preSubmitHandler(e);
  };

  const submitData = async (e, formData) => {
    const resp = await axios.post("/file/answerQuestion", formData);
    window.location = "/adminPanel";
    setMessage(resp.data.message);
  };

  const handleChange = e => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleFileChange = e => {
    setUserData({ ...userData, attachment: e.target.files[0] });
  };

  const preSubmitHandler = e => {
    e.preventDefault();
    if (userData.answer && !userData.attachment) {
      let formData = new FormData();
      formData.append("answer", userData.answer);
      formData.append("username", userData.username);
      formData.append("questionID", id);

      submitData(e, formData);
    } else if (!userData.answer && userData.attachment) {
      let formData = new FormData();
      formData.append("image", userData.attachment);
      formData.append("username", userData.username);
      formData.append("questionID", id);
      formData.set("enctype", "multipart/form-data");

      submitData(e, formData);
    } else if (userData.attachment && userData.answer) {
      let formData = new FormData();
      formData.append("image", userData.attachment);
      formData.append("answer", userData.answer);
      formData.append("username", userData.username);
      formData.append("questionID", id);
      formData.set("enctype", "multipart/form-data");
      submitData(e, formData);
    } else {
      setMessage("Fill all the fields..");
    }
  };

  return (
    <>
      <Navbar props={props} />
      <div id="Qs">
        <br />
        <div id="qtext">
          <h5
            onClick={e => {
              e.target.innerHTML === originalString
                ? (e.target.innerHTML = modifiedString)
                : (e.target.innerHTML = originalString);

              temp = e.target.innerHTML;
            }}
          >
            {temp}
          </h5>
        </div>
        {attachment && <img id="img" src={attachment} alt="No Image added." />}
        <br />
        <br />
        <form id="questionArea">
          <textarea
            name="answer"
            id="qstn"
            cols="100"
            rows="8"
            placeholder="Your Answer Here.."
            onChange={handleChange}
          />
          <br />
          <StyledInput
            name="attachment"
            type="file"
            borderC="transparent"
            onChange={handleFileChange}
          />
          <br />
          <br />
          <StyledInput
            name="username"
            type="text"
            borderC="transparent"
            onChange={handleChange}
            placeholder="Your Name.."
            autoComplete="off"
          />
          <br />
          <br />
          <StyledButton id="ask" onClick={e => confirmChecks(e)}>
            Submit
          </StyledButton>
        </form>
        <br />

        <h4>{message}</h4>
        <br />
        <br />
      </div>
    </>
  );
};

export default Answer;
