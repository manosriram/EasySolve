import React from "react";
import { Route, BrowserRouter } from "react-router-dom";
import Index from "./Components/Index";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Home from "./Components/Home";
import UserQs from "./Components/UserQs";
import AdminPanel from "./Components/AdminPanel";
import Admin from "./Components/Admin";
import Answers from "./Components/Answers";
import ForgotPassword from "./Components/ForgotPassword";
import SetPass from "./Components/SetPass";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Route exact path="/" component={Index} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/home" component={Home} />
        <Route exact path="/userQs" component={UserQs} />
        <Route exact path="/adminPanel" component={AdminPanel} />
        <Route exact path="/answers" component={Answers} />
        <Route exact path="/admin_T_A" component={Admin} />
        <Route exact path="/forgotPassword" component={ForgotPassword} />
        <Route exact path="/setPass" component={SetPass} />
      </BrowserRouter>
    </>
  );
};

export default App;
