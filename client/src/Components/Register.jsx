import React, { useEffect } from "react";
import { StyledInput, StyledButton } from "../Styles/StyledCom";
import { connect } from "react-redux";
import * as actionCreator from "../Store/Actions/registerAction";
import { Link } from "react-router-dom";
import "../Styles/Index.scss";
import Navbar from "./Navbar";

const Register = props => {
  useEffect(() => {
    props.setLoading(false);
  }, []);

  const handleChange = e => {
    props.handleChange(e);
  };

  const handleSubmit = e => {
    var { email, username, password, confirmPass, gender, age, phone } = props;
    var data = {
      email,
      username,
      password,
      confirmPass,
      gender,
      age,
      phone
    };
    props.setLoading(true);
    props.handleSubmit(e, data);
  };

  if (props.isSpinning) {
    return (
      <div class="d-flex justify-content-center" id="spinner">
        <div class="spinner-border" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div id="intro">
      <Navbar />
      <br />
      <br />
      <h3>{props.message}</h3>
      <div id="RegisterForm" onChange={handleChange}>
        <br />
        <StyledInput type="email" placeholder="Email Address" name="email" />
        <br />
        <br />
        <StyledInput type="text" placeholder="Username" name="username" />
        <br />
        <br />
        <StyledInput type="password" placeholder="Password" name="password" />
        <br />
        <br />
        <StyledInput
          type="password"
          placeholder="Confirm Password"
          name="confirmPass"
        />
        <br />
        <br />
        <StyledInput
          type="number"
          placeholder="Phone Number"
          maxLength="10"
          name="phone"
        />
        <br />
        <br />
        <StyledInput type="number" placeholder="Age" maxLength="3" name="age" />
        <br />
        <br />
        <h5>Gender</h5>
        <label>Male</label>
        &nbsp;
        <input type="checkbox" value="Male" name="gender" />
        &nbsp;&nbsp;&nbsp;&nbsp;
        <label>Female</label>
        &nbsp;
        <input type="checkbox" value="Female" name="gender" />
        &nbsp;&nbsp;&nbsp;&nbsp;
        <label>Other</label>
        &nbsp;
        <input type="checkbox" value="Other" name="gender" />
        <br />
        <br />
        <StyledButton onClick={handleSubmit}>Register</StyledButton>
        <br />
        <br />
        <p>
          Already Registered ? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    email: state.Reg.email,
    username: state.Reg.username,
    password: state.Reg.password,
    confirmPass: state.Reg.confirmPass,
    gender: state.Reg.gender,
    age: state.Reg.age,
    phone: state.Reg.phone,
    message: state.Reg.message,
    status: state.Reg.status,
    isSpinning: state.Reg.isSpinning
  };
};

const mapDispatchToProps = dispatch => {
  return {
    handleChange: e => dispatch(actionCreator.handleChange(e)),
    handleSubmit: (e, data) => dispatch(actionCreator.handleSubmit(e, data)),
    setLoading: com => dispatch(actionCreator.setLoading(com))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Register);
