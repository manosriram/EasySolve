import { withRouter, Redirect } from "react-router-dom";
import React from "react";
import "../Styles/Index.scss";
import { Link } from "react-router-dom";
const Cookie = require("js-cookie");

const Navbar = props => {
  const isLoggedIn = Cookie.get("auth_t") ? true : false;

  React.useEffect(() => {
    const upEl = document.getElementById("up");
    upEl.style.display = "none";
  }, []);

  const goBack = () => {
    try {
      if (props.props.history) props.props.history.goBack();
    } catch (er) {
      window.location.reload();
    }
  };

  const Logout = () => {
    Cookie.remove("auth_t");
    Cookie.remove("adTk");
    window.location = "/";
  };

  const handleHAM = e => {
    const upEl = document.getElementById("up");
    const downEl = document.getElementById("down");
    if (e.target.id == "up") {
      upEl.style.display = "none";
      downEl.style.display = "block";
    } else {
      upEl.style.display = "block";
      downEl.style.display = "none";
    }
  };

  return (
    <nav className="navbar navbar-inverse navbar-dark bg-warning">
      <img
        id="backButton"
        src="https://img.icons8.com/ios-filled/50/000000/circled-left.png"
        onClick={goBack}
      />
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
        <img
          src="https://img.icons8.com/ios-filled/35/000000/down.png"
          id="down"
          onClick={e => handleHAM(e)}
        />
        <img
          src="https://img.icons8.com/ios-filled/35/000000/up.png"
          id="up"
          onClick={e => handleHAM(e)}
        />
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
              <Link className="navbar-brand" onClick={Logout} to="">
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
            <li className="nav-item active">
              <Link className="navbar-brand" to="/adminPanel">
                Admin Panel
              </Link>
            </li>
            <li className="nav-item active">
              <Link className="navbar-brand" to="/forgotPassword">
                Forgot Password
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default withRouter(Navbar);
