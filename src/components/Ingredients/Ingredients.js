import React, { useReducer, useEffect, useCallback, useMemo } from "react";

import IngredientForm from "./IngredientForm/IngredientForm";
import Search from "./Search/Search";
import IngredientList from "./IngredientList/IngredientList";
import { transformIngredients } from "../../utils/utils";
import ErrorModal from "../UI/ErrorModal/ErrorModal";
import { useIngredientsHandler } from "../../hooks/useIngredientsHandler";

// manage ingredients with useState()
const Ingredients = () => {
  const {
    ingredients,
    isLoading,
    error,
    clearErrorHandler,
    addIngredientsHandler,
    removeIngredientHandler,
    searchIngredientHandler,
  } = useIngredientsHandler();
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
