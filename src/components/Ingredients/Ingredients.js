import React, { useState, useEffect, useCallback } from "react";

import IngredientForm from "./IngredientForm/IngredientForm";
import Search from "./Search/Search";
import IngredientList from "./IngredientList/IngredientList";
import axios from "../Api/ingredientApi";
// import axiosCors from '../Api/corsIngredientsApi';
import Loader from "../UI/Loader/Loader";

// manage ingredients with useState()
const Ingredients = () => {
  const [ingredients, setIngredients] = useState([]);
  const [isLoading, setisLoading] = useState(false);

  useEffect(() => {
    console.log('RENDERING INGREDIENTS', ingredients);
  }, [ingredients]);

  // filter ingredients based on query
  const searchIngredientHandler = useCallback((filetredIngredient) => {
    setIngredients(filetredIngredient);
  }, []);

  // add igredients to database and on UI
  const addIngredientsHandler = async (ingredient) => {
    try {
      setisLoading(true);
      await axios.post("ingredients.json", ingredient);
      setIngredients((prevIngredients) => [...prevIngredients, ingredient]);
      console.log('ingredients', ingredients);
      setisLoading(false);
    } catch (error) {
      console.log("error adding ingredients", error);
      setisLoading(false);
    }
  };

  // remove ingredients from database and UI
  const removeIngredientHandler = (id) => {
    // 1st approach
    // const newIngredients = [...ingredients].filter((ing) => ing.id !== id);
    // setIngredients(newIngredients);

    // 2nd approach
    setIngredients((prevIngredients) =>
      prevIngredients.filter((ing) => ing.id !== id)
    );
  };


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

  // switch from igredientsList comp to loader if data is saved in firebase
  ingredientsList = isLoading ? <Loader /> : ingredientsList;

  return (
    <div className="App">
      <IngredientForm addIngredientsHandler={addIngredientsHandler} />

      <section style={{ textAlign: "center" }}>
        <Search onSearchIngredient={searchIngredientHandler} />
        {ingredients.length ? (
          ingredientsList
        ) : (
            <p>Plase add new Ingredient.</p>
          )}
      </section>
    </div>
  );
};

export default Ingredients;
