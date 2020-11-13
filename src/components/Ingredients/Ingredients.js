import React, { useState } from "react";

import IngredientForm from "./IngredientForm/IngredientForm";
import Search from "./Search/Search";
import IngredientList from "./IngredientList/IngredientList";
import axios from "../Api/ingredientApi";
import Loader from "../UI/Loader/Loader";

// manage ingredients with useState()
const Ingredients = () => {
  const [ingredients, setIngredients] = useState([]);
  const [loader, setLoader] = useState(false);
  console.log("loader", loader);

  const addIngredientsHandler = async (ingredint) => {
    try {
      setLoader(true);
      const response = await axios.post("ingredients.json", ingredint);
      console.log("response", response);
      setIngredients((prevIngredients) => [...prevIngredients, ingredint]);
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

  let ingredientList = null;

  if (ingredients.length) {
    ingredientList = (
      <IngredientList
        ingredients={ingredients}
        onRemoveItem={removeIngredientHandler}
      />
    );
  }

  ingredientList = loader ? <Loader /> : ingredientList;

  return (
    <div className="App">
      <IngredientForm addIngredientsHandler={addIngredientsHandler} />

      <section style={{ textAlign: "center" }}>
        <Search />
        {ingredients.length ? ingredientList : <p>Plase add new Ingredient.</p>}
      </section>
    </div>
  );
};

export default Ingredients;
