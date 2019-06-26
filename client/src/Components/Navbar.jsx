import React, { useEffect, useState } from "react";
import "../Styles/Index.scss";
import { Link } from "react-router-dom";
const Cookie = require("js-cookie");

const Navbar = props => {
  const isLoggedIn = Cookie.get("auth_t") ? true : false;

  const Logout = () => {
    Cookie.remove("auth_t");
    window.location = "/";
  };

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
      {isLoggedIn && (
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav">
            <li className="nav-item active">
              <Link className="navbar-brand" to="/adminPanel">
                Admin Panel
              </Link>
            </li>
          </ul>
          <ul className="navbar-nav">
            <li className="nav-item active">
              <Link className="navbar-brand" to="/userQs">
                Your Questions
              </Link>
            </li>
          </ul>
          <ul className="navbar-nav ml-auto">
            <li className="nav-item active" id="lg">
              <Link className="navbar-brand" onClick={Logout}>
                Logout
              </Link>
            </li>
          </ul>
        </div>
      )}
      {!isLoggedIn && (
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
