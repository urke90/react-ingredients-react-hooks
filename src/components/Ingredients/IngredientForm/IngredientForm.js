import React from "react";
import { useAddIngredient } from "../../../hooks/useIngedientAdd";
import Card from "../../UI/Card/Card";
import Loader from "../../UI/Loader/Loader";
import "./IngredientForm.css";

// 1. use hooks only inside functional components or other custom hooks
// 2. use hooks inside root of the function ( can't use inside nested function or some if statements )
const IngredientForm = React.memo(({ addIngredientsHandler, loading }) => {
  // returns value and function to update Value of input element
  const title = useAddIngredient("");
  const amount = useAddIngredient("");

  const submitHandler = (event) => {
    event.preventDefault();
    addIngredientsHandler({ title: title.value, amount: amount.value });
  };

  return (
    <section className="ingredient-form">
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Name</label>
            <input type="text" id="title" {...title} />
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input type="number" id="amount" {...amount} />
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
