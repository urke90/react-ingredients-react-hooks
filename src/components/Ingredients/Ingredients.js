import React, { useState } from "react";

import IngredientForm from "./IngredientForm/IngredientForm";
import Search from "./Search/Search";
import IngredientList from "./IngredientList/IngredientList";

// manage ingredients with useState()
const Ingredients = () => {
  const [ingredients, setIngredients] = useState([]);

  const addIngredientsHandler = (ingredint) => {
    console.log("ingredient in Ingredient.js", ingredint);
    setIngredients((prevIngredients) => [...prevIngredients, ingredint]);
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

  console.log("ingredientsssssssss in ingredients,js", ingredients);

  return (
    <div className="App">
      <IngredientForm addIngredientsHandler={addIngredientsHandler} />

      <section>
        <Search />
        {ingredients.length > 0 ? (
          <IngredientList
            ingredients={ingredients}
            onRemoveItem={removeIngredientHandler}
          />
        ) : (
          <p style={{ textAlign: "center" }}>Please add new ingredient!</p>
        )}
      </section>
    </div>
  );
};

export default Ingredients;
