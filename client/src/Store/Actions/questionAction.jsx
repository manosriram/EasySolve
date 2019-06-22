import { postHandler } from "../../Headers";

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

export const submitData = (e, data) => {
  return async dispatch => {
    try {
      const resp = await fetch("/file/addQuestion", {
        method: postHandler.method,
        headers: postHandler.headers,
        body: JSON.stringify({ data })
      });
      const response = await resp.json();
    } catch (er) {
      console.log(er);
    }
  };

  return {
    type: "HANDLE_SUBMIT_Q",
    e
  };
};
