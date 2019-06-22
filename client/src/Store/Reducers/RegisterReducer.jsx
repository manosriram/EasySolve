const initState = {
  email: "",
  username: "",
  password: "",
  confirmPass: "",
  gender: "",
  age: 0,
  phone: 0,
  message: "",
  status: false,
  isSpinning: false
};

const RegReducer = (state = initState, action) => {
  if (action.type === "HANDLE_CHANGE") {
    return {
      ...state,
      [action.e.target.name]: action.e.target.value
    };
  } else if (action.type === "HANDLE_SUBMIT") {
    return {
      ...state,
      status: action.data2.success,
      message: action.data2.errMessage,
      isSpinning: false
    };
  } else if (action.type === "SET_LOADER") {
    return {
      ...state,
      isSpinning: action.com
    };
  }
  return state;
};

export default RegReducer;
