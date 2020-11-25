import React, { useReducer, useEffect, useCallback, useMemo } from "react";

import IngredientForm from "./IngredientForm/IngredientForm";
import Search from "./Search/Search";
import IngredientList from "./IngredientList/IngredientList";
import axios from "../../Api/ingredientApi";
// import corsAxios from "../Api/corsIngredientsApi";
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

const httpReducer = (state, action) => {
  switch (action.type) {
    case "SEND":
      return { ...state, isLoading: true };
    case "RESPONSE":
      return { ...state, isLoading: false };
    case "ERROR":
      return { isLoading: false, error: action.errorMessage };
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
  const { isLoading, error, data, sendRequest } = useHttp();
  console.log("1", isLoading);
  console.log("2", error);
  console.log("3", data);
  console.log("4", sendRequest);

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
  const addIngredientsHandler = useCallback(async (ingredient) => {
    try {
      dispatchHttp({ type: "SEND" });
      // setisLoading(true);
      const response = await axios.post("ingredients.json", ingredient);

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
  }, []);

  // remove ingredients from database and UI
  const removeIngredientHandler = useCallback(
    async (id) => {
      // 1st approach using setState()
      // const newIngredients = [...ingredients].filter((ing) => ing.id !== id);
      // setIngredients(newIngredients);
      sendRequest("DELETE", `ingredients/${id}.json`);
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

  const clearErrorMessageHandler = useCallback(() => {
    dispatchHttp({ type: "CLEAR" });
  }, []);

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

  // render ingredients only if there are ingredients

  return (
    <div className="App">
      {error && (
        <ErrorModal onClose={clearErrorMessageHandler}>{error}</ErrorModal>
      )}
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
