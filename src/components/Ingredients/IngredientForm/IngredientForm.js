import React, { useState } from "react";
// import { v4 as uuidv4 } from "uuid";

import Card from "../../UI/Card/Card";
import Loader from "../../UI/Loader/Loader";
import "./IngredientForm.css";

// 1. use hooks only inside functional components or other custom hooks
// 2. use hooks inside root of the function ( can't use inside nested function or some if statements )
// useState hooks == state ={}, for each input create separate hooks
const IngredientForm = React.memo(({ addIngredientsHandler, loading }) => {
  // useState always returns 2 elements
  // 1. arr[0] === value we assign ine useState()
  // 2. arr[1] === function to update the state
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");

  const submitHandler = (event) => {
    event.preventDefault();
    addIngredientsHandler({ title, amount });
  };

  return (
    <section className="ingredient-form">
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Name</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
            />
          </div>
          <div className="ingredient-form__actions">
            <button type="submit">Add Ingredient</button>
            {loading && <Loader />}
          </div>
        </form>
      </Card>
    </section>
  );
});

export default IngredientForm;
