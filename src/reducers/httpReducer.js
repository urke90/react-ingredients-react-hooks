export const SEND = "SEND";
export const RESPONSE = "RESPONSE";
export const ERROR = "SEND";
export const CLEAR = "CLEAR";

// initial state for httpReducer
export const initState = {
  isLoading: false,
  error: null,
  responseData: null,
  extra: null,
  identifier: "",
};

// http reducer
export const httpReducer = (state = initState, action) => {
  switch (action.type) {
    case SEND:
      return {
        isLoading: true,
        extra: null,
        responseData: null,
        error: null,
        identifier: action.reqIdentifier,
      };
    case RESPONSE:
      return {
        ...state,
        isLoading: false,
        responseData: action.responseData,
        extra: action.reqExtra,
      };
    case ERROR:
      return {
        identifier: "",
        responseData: null,
        isLoading: false,
        error: action.errorMessage,
      };
    case CLEAR:
      return state;
    default:
      return state;
  }
};
