import React, { useReducer, useEffect, useCallback } from "react";

import IngredientForm from "./IngredientForm/IngredientForm";
import Search from "./Search/Search";
import IngredientList from "./IngredientList/IngredientList";
import axios from "../Api/ingredientApi";
import corsAxios from "../Api/corsIngredientsApi";
import ErrorModal from "../UI/ErrorModal/ErrorModal";

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

const httpReducer = (state, action) => {
  switch (action.type) {
    case "SEND":
      return { ...state, isLoading: true };
    case "RESPONSE":
      return { ...state, isLoading: false };
    case "ERROR":
      return { ...state, error: action.errorMessage };
    case "CLEAR":
      return { ...state, error: null };
    default:
      return state;
  }
};

// manage ingredients with useState()
const Ingredients = () => {
  // approach with setState()
  // const [ingredients, setIngredients] = useState([]);
  // const [isLoading, setisLoading] = useState(false);
  // const [errorMessage, setErrorMessage] = useState();

  const [ingredients, dispatchIngredients] = useReducer(ingredientsReducer, []);
  const [httpState, dispatchHttp] = useReducer(httpReducer, {
    isLoading: false,
    error: null,
  });

  // fetching init ingredients from database
  useEffect(() => {
    const fetchInitIngredients = async () => {
      try {
        dispatchHttp({ type: "SEND" });
        // setisLoading(true);
        const response = await axios.get(`/ingredients.json`);
        const ingredientsData = response.data;
        const transformedIngredients = [];

        for (let key in ingredientsData) {
          transformedIngredients.push({
            id: key,
            title: ingredientsData[key]["title"],
            amount: ingredientsData[key]["amount"],
          });
        }
        // using setState()
        // setIngredients(transformedIngredients);

        dispatchIngredients({
          type: "SET",
          ingredients: transformedIngredients,
        });

        dispatchHttp({ type: "RESPONSE" });
        // setisLoading(false);
      } catch (error) {
        console.log("error", error.message);

        dispatchHttp({ type: "ERROR", errorMessage: error.message });
        // setErrorMessage(error.message);
        // setisLoading(false);
      }
    };

    fetchInitIngredients();
  }, []);

  // useEffect(() => {
  //   console.log("RENDERING INGREDIENTS", ingredients);
  // }, [ingredients]);

  // add igredients to database and on UI
  const addIngredientsHandler = async (ingredient) => {
    try {
      dispatchHttp({ type: "SEND" });
      // setisLoading(true);
      const response = await corsAxios.post("ingredients.json", ingredient);

      // using setState()
      // setIngredients((prevIngredients) => [
      //   ...prevIngredients,
      //   { id: response.data.name, ...ingredient },
      // ]);

      // using useReducer
      dispatchIngredients({
        type: "ADD",
        ingredient: { id: response.data.name, ...ingredient },
      });
      dispatchHttp({ type: "RESPONSE" });

      // setisLoading(false);
    } catch (error) {
      console.log("error adding ingredients", error);
      dispatchHttp({ type: "ERROR", errorMessage: error.message });

      // setErrorMessage(error.message);
      // setisLoading(false);
    }
  };

  // remove ingredients from database and UI
  const removeIngredientHandler = async (id) => {
    // 1st approach using setState()
    // const newIngredients = [...ingredients].filter((ing) => ing.id !== id);
    // setIngredients(newIngredients);

    try {
      dispatchHttp({ type: "SEND" });
      // setisLoading(true);
      await axios.delete(`ingredients/${id}.json`);
      // 2nd approach using setState()
      // setIngredients((prevIngredients) =>
      //   prevIngredients.filter((ing) => ing.id !== id)
      // );

      // using useReducer()
      dispatchIngredients({ type: "REMOVE", ingredientId: id });

      dispatchHttp({ type: "RESPONSE" });
      // setisLoading(false);
    } catch (error) {
      console.log("error deleting ingredient", error);

      dispatchHttp({ type: "ERROR", errorMessage: error.message });
      // setErrorMessage(error.message);
      // setisLoading(false);
    }
  };

  // filter ingredients based on query
  const searchIngredientHandler = useCallback((filetredIngredients) => {
    // using setState()
    // setIngredients(filetredIngredients);

    // using useReducer()
    dispatchIngredients({ type: "SET", ingredients: filetredIngredients });
  }, []);

  const clearErrorMessageHandler = () => dispatchHttp(null);

  let ingredientsList = null;

  // render ingredients only if there are ingredients
  if (ingredients.length) {
    ingredientsList = (
      <IngredientList
        ingredients={ingredients}
        onRemoveItem={removeIngredientHandler}
      />
    );
  }

  return (
    <div className="App">
      {httpState.error && (
        <ErrorModal onClose={clearErrorMessageHandler}>
          {httpState.error}
        </ErrorModal>
      )}
      <IngredientForm
        addIngredientsHandler={addIngredientsHandler}
        loading={httpState.isLoading}
      />

      <section style={{ textAlign: "center" }}>
        <Search onSearchIngredient={searchIngredientHandler} />

        {ingredientsList || <p>Plase add new Ingredient.</p>}
      </section>
    </div>
  );
};

export default Ingredients;
