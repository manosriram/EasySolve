import React, { useEffect } from "react";
import Navbar from "./Navbar";
import "../Styles/Index.scss";
import { StyledInput, StyledButton } from "../Styles/StyledCom";
const ck = require("js-cookie");

const SetPass = props => {
  const [msg, setMSG] = React.useState("");
  const [data, setData] = React.useState({});
  const [isSpinning, setSpinner] = React.useState(true);

  useEffect(() => {
    setSpinner(false);
  }, []);

  const cancelPC = () => {
    ck.remove("scs");
    ck.remove("em_us_");
    window.location = "/";
  };

  const handleChange = e => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    if (!data.password || !data.confPassword) {
      setMSG("Fill all fields..");
      return;
    }

    if (data.password !== data.confPassword) {
      setMSG("Passwords don't Match.");
      return;
    }

    if (data.password.length < 4) {
      setMSG("Password too short. (Min. 5 characters)");
      return;
    }

    setSpinner(true);
    const resp = await fetch("/auth/updatePassword", {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userData: {
          password: data.password,
          confPassword: data.confPassword
        }
      })
    });
    const data_ = await resp.json();
    setSpinner(false);
    setMSG(data_.message);
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
      <Navbar />
      <div id="LoginForm" onChange={handleChange}>
        <br />
        <h4>{msg}</h4>
        <br />
        <StyledInput
          type="password"
          placeholder="New Password"
          name="password"
        />
        <br />
        <br />
        <StyledInput
          type="password"
          placeholder="Confirm Password"
          name="confPassword"
        />
        <br />
        <br />
        <StyledButton onClick={handleSubmit}>Update Password</StyledButton>
        <br />
        <br />
        <a href="/" onClick={cancelPC}>
          Cancel
        </a>
      </div>
      <div className="footerElse">
        <a id="anc">Update Password</a>
      </div>
    </>
  );
};

export default SetPass;
