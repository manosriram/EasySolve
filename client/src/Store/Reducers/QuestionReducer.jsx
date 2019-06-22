const initState = {
  question: "",
  attachment: {},
  user: ""
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
      attachment: action.e.target.files[0]
    };
  } else if (action.type === "HANDLE_SUBMIT_Q") {
    return state;
  }

  return state;
};

export default QuestionReducer;
