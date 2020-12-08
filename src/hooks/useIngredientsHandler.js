import { useEffect, useReducer, useCallback } from "react";
import { useHttp } from "./useHttp";
import {
  ingredientsReducer,
  SET,
  ADD,
  REMOVE,
} from "../reducers/ingredientsReducer";
import { transformIngredients } from "../utils/utils";

export const useIngredientsHandler = () => {
  const [ingredients, dispatchIngredients] = useReducer(ingredientsReducer, []);
  const {
    isLoading,
    error,
    responseData,
    sendRequest,
    extra,
    identifier,
    clearErrorHandler,
  } = useHttp();

  // fetching init ingredients from database
  useEffect(() => {
    sendRequest("GET", "ingredients.json", null, null, "SET_INGREDIENTS");
  }, []);

  useEffect(() => {
    if (identifier === "REMOVE_INGREDIENT") {
      dispatchIngredients({ type: REMOVE, ingredientId: extra });
    } else if (identifier === "ADD_INGREDIENT" && responseData && extra) {
      dispatchIngredients({
        type: ADD,
        ingredient: { id: responseData.name, ...extra },
      });
    } else if (identifier === "SET_INGREDIENTS" && responseData) {
      dispatchIngredients({
        type: SET,
        ingredients: transformIngredients(responseData),
      });
    }
  }, [extra, responseData, identifier, isLoading]);

  // add igredients to database and on UI
  const addIngredientsHandler = useCallback(
    async (ingredient) => {
      console.log("ingredient in addIngredientsHandler", ingredient);
      sendRequest(
        "POST",
        "ingredients.json",
        ingredient,
        ingredient,
        "ADD_INGREDIENT"
      );
    },
    [sendRequest]
  );

  // remove ingredients from database and UI
  const removeIngredientHandler = useCallback(
    async (id) => {
      // 1st approach using setState()
      // const newIngredients = [...ingredients].filter((ing) => ing.id !== id);
      // setIngredients(newIngredients);
      sendRequest(
        "DELETE",
        `ingredients/${id}.json`,
        null,
        id,
        "REMOVE_INGREDIENT"
      );
    },
    [sendRequest]
  );

  // filter ingredients based on query
  const searchIngredientHandler = useCallback((filetredIngredients) => {
    dispatchIngredients({ type: "SET", ingredients: filetredIngredients });
  }, []);

  return {
    ingredients,
    isLoading,
    error,
    responseData,
    sendRequest,
    extra,
    identifier,
    clearErrorHandler,
    addIngredientsHandler,
    removeIngredientHandler,
    searchIngredientHandler,
  };
};
