import { postHandler } from "../../Headers";
const axios = require("axios");

export const handleChange = e => {
  return {
    type: "HANDLE_CHANGE",
    e
  };
};

export const handleFileChange = e => {
  return {
    type: "HANDLE_FILE_CHANGE",
    e
  };
};

export const setUser = user => {
  return {
    type: "SET_U",
    user
  };
};

export const submitData = (e, data) => {
  return async dispatch => {
    try {
      let msg;
      const resp = await axios.post("/file/addQuestion", data);
      if (resp.data.success) {
        msg = resp.data.message;
      } else {
        msg = "Error uploading file..";
      }
      dispatch({ type: "HANDLE_SUBMIT_Q", e, msg });
    } catch (er) {
      console.log(er);
    }
  };
};

export const setMessage = msg => {
  return {
    type: "SET_MSG",
    msg
  };
};

export const setQs = qs => {
  return {
    type: "SET_QS",
    qs
  };
};
