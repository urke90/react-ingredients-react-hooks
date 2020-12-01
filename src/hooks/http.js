import { useReducer, useCallback } from "react";
import axios from "../Api/ingredientApi";

// initial state for httpReducer
const initState = {
  isLoading: false,
  error: null,
  responseData: null,
  extra: null,
  identifier: "",
};

// http reducer
const httpReducer = (state, action) => {
  switch (action.type) {
    case "SEND":
      return {
        isLoading: true,
        extra: null,
        responseData: null,
        error: null,
        identifier: action.reqIdentifier,
      };
    case "RESPONSE":
      return {
        ...state,
        isLoading: false,
        responseData: action.responseData,
        extra: action.reqExtra,
      };
    case "ERROR":
      return {
        identifier: "",
        responseData: null,
        isLoading: false,
        error: action.errorMessage,
      };
    case "CLEAR":
      return initState;
    default:
      return state;
  }
};

// custom hook that holds logic for sending request, and sharing data
const useHttp = () => {
  const [httpState, dispatchHttp] = useReducer(httpReducer, initState);

  const { isLoading, error, responseData, extra, identifier } = httpState;

  // clears error on closing error modal
  const clearErrorHandler = useCallback(
    () => dispatchHttp({ type: "CLEAR" }),
    []
  );

  // handling send requests
  const sendRequest = useCallback(
    async (method, url, dataToSend, reqExtra, reqIdentifier) => {
      try {
        dispatchHttp({
          type: "SEND",
          reqIdentifier,
        });
        const response = await axios({
          method,
          url,
          data: dataToSend,
        });

        dispatchHttp({
          type: "RESPONSE",
          responseData: response.data,
          reqExtra,
        });
      } catch (error) {
        console.log("error in sendRequest");
        dispatchHttp({ type: "ERROR", errorMessage: error.message });
      }
    },
    []
  );

  return {
    isLoading,
    error,
    responseData,
    sendRequest,
    extra,
    identifier,
    clearErrorHandler,
  };
};

export default useHttp;
