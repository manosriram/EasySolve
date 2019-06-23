const initState = {
  question: "",
  attachment: null,
  user: "",
  message: "",
  questions: [],
  isSpinning: false
};

const QuestionReducer = (state = initState, action) => {
  if (action.type === "HANDLE_CHANGE") {
    return {
      ...state,
      [action.e.target.name]: action.e.target.value
    };
  } else if (action.type === "HANDLE_FILE_CHANGE") {
    return {
      ...state,
      attachment: action.e.target.files
    };
  } else if (action.type === "HANDLE_SUBMIT_Q") {
    return {
      ...state,
      message: action.msg
    };
  } else if (action.type === "SET_U") {
    return {
      ...state,
      user: action.user
    };
  } else if (action.type === "SET_MSG") {
    return {
      ...state,
      message: action.msg
    };
  } else if (action.type === "SET_QS") {
    return {
      ...state,
      questions: action.qs.questions
    };
  }

  return state;
};

export default QuestionReducer;
