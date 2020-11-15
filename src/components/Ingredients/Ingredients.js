import React, { useState, useEffect } from "react";

import IngredientForm from "./IngredientForm/IngredientForm";
import Search from "./Search/Search";
import IngredientList from "./IngredientList/IngredientList";
import axios from "../Api/ingredientApi";
import Loader from "../UI/Loader/Loader";

// manage ingredients with useState()
const Ingredients = () => {
  const [ingredients, setIngredients] = useState([]);
  const [isLoading, setLoader] = useState(false);

  // add igredients to database and on UI
  const addIngredientsHandler = async (ingredient) => {
    try {
      setLoader(true);
      await axios.post("ingredients.json", ingredient);
      setIngredients((prevIngredients) => [...prevIngredients, ingredient]);
      setLoader(false);
    } catch (error) {
      console.log("error adding ingredients", error);
      setLoader(false);
    }
  };

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
        <Search />
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
