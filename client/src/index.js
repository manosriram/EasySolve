import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

import { createStore, applyMiddleware, combineReducers } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";

import LogReducer from "./Store/Reducers/LoginReducer";
import RegReducer from "./Store/Reducers/RegisterReducer";
import QuestionReducer from "./Store/Reducers/QuestionReducer";

const rootReducer = combineReducers({
  Log: LogReducer,
  Reg: RegReducer,
  Qs: QuestionReducer
});

let store = createStore(rootReducer, applyMiddleware(thunk));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
