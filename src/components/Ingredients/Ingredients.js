import React, { useState, useEffect } from "react";

import IngredientForm from "./IngredientForm/IngredientForm";
import Search from "./Search/Search";
import IngredientList from "./IngredientList/IngredientList";
import axios from "../Api/ingredientApi";
import axiosCors from '../Api/corsIngredientsApi';
import Loader from "../UI/Loader/Loader";

// manage ingredients with useState()
const Ingredients = () => {
  const [ingredients, setIngredients] = useState([]);
  const [isLoading, setisLoading] = useState(false);

  useEffect(() => {
    const getIngredients = async () => {
      setisLoading(true);

      try {
        const response = await axios.get('/ingredients.json');
        const ingredientsData = response.data;
        const transformedIngredients = [];

        for (let key in ingredientsData) {
          transformedIngredients.push(ingredientsData[key]);
        }

        setIngredients(transformedIngredients);
        setisLoading(false);
      } catch (error) {
        console.log('error fetching ingredients', error);
        setisLoading(false);
      }

    };

    getIngredients();
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

  const removeIngredientHandler = (id) => {
    // 1st approach
    // const newIngredients = [...ingredients].filter((ing) => ing.id !== id);
    // setIngredients(newIngredients);

    // 2nd approach
    setIngredients((prevIngredients) =>
      prevIngredients.filter((ing) => ing.id !== id)
    );
  };

  console.log('ingredients', ingredients);

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
