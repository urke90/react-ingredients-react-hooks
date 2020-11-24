import React from "react";

import "./IngredientList.css";

const IngredientList = ({ ingredients, onRemoveItem }) => {
  console.log("RENDER INGRDIENT LIST");
  return (
    <section className="ingredient-list">
      <h2>Loaded Ingredients</h2>
      <ul>
        {ingredients.map(({ id, title, amount }) => (
          <li key={id} onClick={onRemoveItem.bind(this, id)}>
            <span>{title}</span>
            <span>{amount}x</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default IngredientList;
