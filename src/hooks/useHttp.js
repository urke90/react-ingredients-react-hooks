import { useReducer, useCallback } from "react";
import axios from "../Api/ingredientApi";
import { httpReducer, initState } from "../reducers/httpReducer";

// custom hook that holds logic for sending request, and sharing data
export const useHttp = () => {
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
