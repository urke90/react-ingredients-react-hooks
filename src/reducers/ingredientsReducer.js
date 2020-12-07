export const SET = "SET";
export const ADD = "ADD";
export const REMOVE = "REMOVE";

const initState = [];

// reducer for ADD/REMOVE/SET ingredients
// defined outside Ingredints component since there is no need to re-render reducer
export const ingredientsReducer = (state = initState, action) => {
  switch (action.type) {
    case SET:
      return action.ingredients;
    case ADD:
      return [...state, action.ingredient];
    case REMOVE:
      return state.filter(
        (ingredient) => ingredient.id !== action.ingredientId
      );
    default:
      return state;
  }
};
