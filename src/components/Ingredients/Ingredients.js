import React, { useState, useReducer, useEffect, useCallback } from "react";

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
    case "DELETE":
      return state.filter(
        (ingredient) => ingredient.id !== action.ingredientId
      );
    default:
      return state;
  }
};

// manage ingredients with useState()
const Ingredients = () => {
  // approach with setState()
  // const [ingredients, setIngredients] = useState([]);
  const [ingredients, dispatch] = useReducer(ingredientsReducer, []);
  const [isLoading, setisLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  // fetching init ingredients from database
  useEffect(() => {
    const fetchInitIngredients = async () => {
      try {
        setisLoading(true);
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

        dispatch({ type: "SET", ingredients: transformedIngredients });
        setisLoading(false);
      } catch (error) {
        console.log("error", error.message);
        setErrorMessage(error.message);
        setisLoading(false);
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
      setisLoading(true);
      const response = await corsAxios.post("ingredients.json", ingredient);

      // using setState()
      // setIngredients((prevIngredients) => [
      //   ...prevIngredients,
      //   { id: response.data.name, ...ingredient },
      // ]);

      // using useReducer
      dispatch({
        type: "ADD",
        ingredient: { id: response.data.name, ...ingredient },
      });
      setisLoading(false);
    } catch (error) {
      console.log("error adding ingredients", error);
      setErrorMessage(error.message);
      setisLoading(false);
    }
  };

  // remove ingredients from database and UI
  const removeIngredientHandler = async (id) => {
    // 1st approach using setState()
    // const newIngredients = [...ingredients].filter((ing) => ing.id !== id);
    // setIngredients(newIngredients);

    try {
      setisLoading(true);
      await axios.delete(`ingredients/${id}.json`);
      // 2nd approach using setState()
      // setIngredients((prevIngredients) =>
      //   prevIngredients.filter((ing) => ing.id !== id)
      // );

      // using useReducer()
      dispatch({ type: "DELETE", ingredientId: id });

      setisLoading(false);
    } catch (error) {
      console.log("error deleting ingredient", error);
      setErrorMessage(error.message);
      setisLoading(false);
    }
  };

  // filter ingredients based on query
  const searchIngredientHandler = useCallback((filetredIngredients) => {
    // using setState()
    // setIngredients(filetredIngredients);

    // using useReducer()
    dispatch({ type: "SET", ingredients: filetredIngredients });
  }, []);

  const clearErrorMessageHandler = () => setErrorMessage(null);

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
      {errorMessage && (
        <ErrorModal onClose={clearErrorMessageHandler}>
          {errorMessage}
        </ErrorModal>
      )}
      <IngredientForm
        addIngredientsHandler={addIngredientsHandler}
        loading={isLoading}
      />

      <section style={{ textAlign: "center" }}>
        <Search onSearchIngredient={searchIngredientHandler} />

        {ingredientsList || <p>Plase add new Ingredient.</p>}
      </section>
    </div>
  );
};

export default Ingredients;
