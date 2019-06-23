import React from "react";
import { Route, BrowserRouter } from "react-router-dom";
import Index from "./Components/Index";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Home from "./Components/Home";
import UserQs from "./Components/UserQs";
import Navbar from "./Components/Navbar";

const App = () => {
  return (
    <>
      <BrowserRouter>
        {/* <Navbar /> */}
        <Route exact path="/" component={Index} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/home" component={Home} />
        <Route exact path="/userQs" component={UserQs} />
      </BrowserRouter>
    </>
  );
};

export default App;
