import React, { useReducer, useEffect, useCallback, useMemo } from "react";

import IngredientForm from "./IngredientForm/IngredientForm";
import Search from "./Search/Search";
import IngredientList from "./IngredientList/IngredientList";
import { transformIngredients } from "../../utils/utils";
import ErrorModal from "../UI/ErrorModal/ErrorModal";
import useHttp from "../../hooks/http";

// reducer for ADD/REMOVE/SET ingredients
// defined outside Ingredints component since there is no need to re-render reducer
const ingredientsReducer = (state, action) => {
  switch (action.type) {
    case "SET":
      return action.ingredients;
    case "ADD":
      return [...state, action.ingredient];
    case "REMOVE":
      return state.filter(
        (ingredient) => ingredient.id !== action.ingredientId
      );
    default:
      return state;
  }
};

// manage ingredients with useState()
const Ingredients = () => {
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
  // TODO figure out how to get ingredients from firebase immediatelly
  useEffect(() => {
    const fetchInitIngredients = async () => {
      sendRequest("GET", "ingredients.json", null, null, "SET_INGREDIENTS");
    };

    fetchInitIngredients();
  }, []);

  useEffect(() => {
    if (identifier === "REMOVE_INGREDIENT") {
      dispatchIngredients({ type: "REMOVE", ingredientId: extra });
    } else if (identifier === "ADD_INGREDIENT" && responseData && extra) {
      dispatchIngredients({
        type: "ADD",
        ingredient: { id: responseData.name, ...extra },
      });
    } else if (identifier === "SET_INGREDIENTS" && responseData) {
      dispatchIngredients({
        type: "SET",
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
    // using setState()
    // setIngredients(filetredIngredients);

    // using useReducer()
    dispatchIngredients({ type: "SET", ingredients: filetredIngredients });
  }, []);

  // Just an example for useMemo ===> better to use React.memo in component itself
  const ingredientListComponent = useMemo(() => {
    let ingredientsList = null;
    if (ingredients.length) {
      ingredientsList = (
        <IngredientList
          ingredients={ingredients}
          onRemoveItem={removeIngredientHandler}
        />
      );
    }
    return ingredientsList;
  }, [ingredients, removeIngredientHandler]);

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearErrorHandler}>{error}</ErrorModal>}
      <IngredientForm
        addIngredientsHandler={addIngredientsHandler}
        loading={isLoading}
      />

      <section style={{ textAlign: "center" }}>
        <Search onSearchIngredient={searchIngredientHandler} />

        {ingredientListComponent || <p>Plase add new Ingredient.</p>}
      </section>
    </div>
  );
};

export default Ingredients;
