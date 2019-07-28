import React from "react";
import Navbar from "./Navbar";
import { StyledInput, StyledButton } from "../Styles/StyledCom";
import "../Styles/Index.scss";

const ForgotPassword = props => {
  const handleChange = () => {};
  const handleSubmit = () => {};

  return (
    <>
      <Navbar />
      <div id="LoginForm" onChange={handleChange}>
        <h3>{props.message}</h3>
        <br />
        <br />
        <StyledInput
          type="number"
          placeholder="Phone Number"
          name="phone"
          maxLength={10}
        />
        <br />
        <br />
        <StyledButton onClick={handleSubmit}>Send OTP</StyledButton>
        <br />
        <br />
      </div>
    </>
  );
};

export default ForgotPassword;
