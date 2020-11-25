import { useReducer, useCallback } from "react";
import axios from "../Api/ingredientApi";

const httpReducer = (state, action) => {
  switch (action.type) {
    case "SEND":
      return { ...state, isLoading: true, data: null };
    case "RESPONSE":
      return { ...state, isLoading: false, data: action.responseData };
    case "ERROR":
      return { isLoading: false, error: action.errorMessage };
    case "CLEAR":
      return { ...state, error: null };
    default:
      return state;
  }
};

// TODO finish useHttp
const useHttp = () => {
  const [httpState, dispatchHttp] = useReducer(httpReducer, {
    isLoading: false,
    error: null,
    data: null,
  });
  const { isLoading, error, data } = httpState;
  const sendRequest = useCallback(async (method, url, data) => {
    try {
      dispatchHttp({ type: "SEND" });
      const response = await axios({
        method,
        url,
        data,
      });
      dispatchHttp({ type: "RESPONSE", responseData: response.data });
    } catch (error) {
      console.log("error in sendRequest");
      dispatchHttp({ type: "ERROR", errorMessage: error.message });
    }
  }, []);

  return {
    isLoading,
    error,
    data,
    sendRequest,
  };
};

export default useHttp;
