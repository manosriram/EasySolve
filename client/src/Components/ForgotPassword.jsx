import React from "react";
import Navbar from "./Navbar";
import { StyledInput, StyledButton } from "../Styles/StyledCom";
import "../Styles/Index.scss";
import SetPass from "./SetPass";
const ck = require("js-cookie");

const ForgotPassword = props => {
  const [email, setEmail] = React.useState("");
  const [msg, setMSG] = React.useState("");
  const [isSpinning, setSpinner] = React.useState(true);

  React.useEffect(() => {
    setSpinner(false);
  }, []);

  const handleChange = e => {
    setEmail({ ...email, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!email || email.length < 5) {
      setMSG("Fill fields..");
      return;
    }

    setSpinner(true);
    const resp = await fetch("/auth/forgotPassword", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email })
    });
    const data = await resp.json();
    setSpinner(false);
    setMSG(data.message);
  };

  if (ck.get("scs")) {
    return <SetPass />;
  }

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
      <Navbar />
      <br />
      <div id="LoginForm" onChange={handleChange}>
        <br />
        <h4>{msg}</h4>
        <br />
        <StyledInput
          type="email"
          placeholder="Email Address"
          name="email"
          onChange={handleChange}
        />
        <br />
        <br />
        <StyledButton onClick={handleSubmit}>Send Link</StyledButton>
        <br />
        <br />
      </div>
      <div className="footerElse">
        <a id="anc">Forgot Password.</a>
      </div>
    </>
  );
};

export default ForgotPassword;
