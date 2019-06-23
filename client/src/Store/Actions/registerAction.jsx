import { postHandler } from "../../Headers";

export const handleChange = e => {
  return {
    type: "HANDLE_CHANGE",
    e
  };
};

export const handleSubmit = (e, data) => {
  e.persist();
  return async dispatch => {
    try {
      const resp = await fetch("/auth/register", {
        method: postHandler.method,
        headers: postHandler.headers,
        body: JSON.stringify({ data })
      });
      const data2 = await resp.json();

      dispatch({ type: "HANDLE_SUBMIT", e, data2 });
    } catch (er) {
      console.log(er);
    }
  };
};

export const setLoading = com => {
  return {
    type: "SET_LOADER",
    com
  };
};
