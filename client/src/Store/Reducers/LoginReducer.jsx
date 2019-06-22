const initState = {
  email: "",
  password: "",
  isSpinning: false,
  message: "",
  loggedInStatus: false
};

const LogReducer = (state = initState, action) => {
  if (action.type === "HANDLE_CHANGE") {
    return {
      ...state,
      [action.e.target.name]: action.e.target.value
    };
  } else if (action.type === "SET_LOADER") {
    return {
      ...state,
      isSpinning: action.com
    };
  } else if (action.type === "LOGIN_SUBMIT") {
    return {
      ...state,
      message: action.data2.errMessage,
      loggedInStatus: action.data2.success,
      isSpinning: false
    };
  } else if (action.type === "SET_LOGIN_STATUS") {
    return {
      ...state,
      loggedInStatus: action.com,
      isSpinning: false
    };
  }

  return state;
};

export default LogReducer;
