import "../Styles/Auth.scss";
import React, { useEffect, useState } from "react";
import { StyledInput, StyledButton } from "../Styles/StyledCom";
const axios = require("axios");

const Answer = ({ question, id, attachment }, props) => {
  const [file, setFile] = useState("");
  const [userData, setUserData] = useState({});
  const [message, setMessage] = useState("");

  const submitData = async (e, formData) => {
    const resp = await axios.post("/file/answerQuestion", formData);
    console.log(resp);
  };

  const handleChange = e => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
    console.log(userData);
  };

  const handleFileChange = e => {
    // setFile(e.target.files[0]);
    setUserData({ ...userData, attachment: e.target.files[0] });
    console.log(file);
  };

  const preSubmitHandler = e => {
    e.preventDefault();
    if (userData.answer && !userData.attachment) {
      let formData = new FormData();
      formData.append("answer", userData.answer);
      formData.append("username", userData.username);
      formData.append("questionID", id);

      submitData(e, formData);
      return;
    }
    if (userData.attachment || userData.answer) {
      let formData = new FormData();
      formData.append("imageFile", userData.attachment);
      formData.append("answer", userData.answer);
      formData.append("username", userData.username);
      formData.append("questionID", id);
      formData.set("enctype", "multipart/form-data");
      submitData(e, formData);
      return;
    } else {
      setMessage("Fill all the fields..");
      return;
    }
  };

  var originalString = question;
  var modifiedString =
    originalString.length > 20
      ? originalString.substr(0, 20) + "..."
      : originalString;
  return (
    <>
      <div id="Qs">
        <h4>{message}</h4>
        <div id="qtext">
          <h5 onClick={e => (e.target.innerHTML = originalString)}>
            {modifiedString}
          </h5>
        </div>
        <img id="img" src={attachment} alt="No Image added." />
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
          />
          <br />
          <br />
          <StyledButton id="ask" onClick={preSubmitHandler}>
            Submit
          </StyledButton>
        </form>
        <br />
        <br />
      </div>
    </>
  );
};

export default Answer;
