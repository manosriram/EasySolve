import React, { useEffect } from "react";
import "../Styles/Index.scss";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import * as actionCreator from "../Store/Actions/loginAction";

const Navbar = props => {
  return (
    <nav className="navbar navbar-expand-lg navbar navbar-dark bg-warning">
      <Link className="navbar-brand" to="/">
        HOME
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNavDropdown"
        aria-controls="navbarNavDropdown"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" />
      </button>
      {props.isLoggedIn && (
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav">
            <li className="nav-item active">
              <Link className="navbar-brand" to="#">
                Your Questions
              </Link>
            </li>
          </ul>
        </div>
      )}
      {!props.isLoggedIn && (
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav">
            <li className="nav-item active">
              <Link className="navbar-brand" to="/login">
                Login
              </Link>
            </li>
            <li className="nav-item active">
              <Link className="navbar-brand" to="/register">
                Register
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
