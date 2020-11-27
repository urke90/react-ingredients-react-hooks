import { useReducer, useCallback } from "react";
import axios from "../Api/ingredientApi";

const httpReducer = (state, action) => {
  switch (action.type) {
    case "SEND":
      return {
        ...state,
        isLoading: true,
        extra: action.reqExtra,
        identifier: action.reqIdentifier,
      };
    case "RESPONSE":
      return { ...state, isLoading: false, responseData: action.responseData };
    case "ERROR":
      return { isLoading: false, error: action.errorMessage };
    case "CLEAR":
      return { ...state, error: null };
    default:
      return state;
  }
};

// TODO finish useHttp smisliti logiku za add i remove ingredients, za set cu morati drugacije nesto, jer imam
// TODO logiku za transformaciju ingredietns sto je slicna kao za filtriranje ingredients
// TODO ZA ADD I REMOVE MORAM DA POSALJEM ********** INGREDIENT i ID *******************

const useHttp = () => {
  const [httpState, dispatchHttp] = useReducer(httpReducer, {
    isLoading: false,
    error: null,
    responseData: null,
    extra: null,
    identifier: "",
  });

  const { isLoading, error, responseData, extra, identifier } = httpState;

  const sendRequest = useCallback(
    async (method, url, dataToSend, reqExtra, reqIdentifier) => {
      try {
        dispatchHttp({
          type: "SEND",
          reqExtra,
          reqIdentifier,
        });
        const response = await axios({
          method,
          url,
          data: dataToSend,
        });

        dispatchHttp({ type: "RESPONSE", responseData: response.data });
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
  };
};

export default useHttp;
