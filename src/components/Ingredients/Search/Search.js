import React, { useState } from "react";

import Card from "../../UI/Card/Card";
import axios from "../../Api/ingredientApi";

import "./Search.css";

const Search = React.memo(({ onSearchIngredient }) => {
  const [searchValue, setSearchValue] = useState("");

  // get ingredient by title from database when user submits form
  const searchIngreientHandler = async (event) => {
    event.preventDefault();
    try {
      const query = searchValue.length
        ? `?orderBy="title"&equalTo="${searchValue}"`
        : "";
      const response = await axios.get(`/ingredients.json${query}`);
      const ingredientsData = response.data;
      const transformedIngredients = [];

      for (let key in ingredientsData) {
        transformedIngredients.push({
          id: key,
          amount: ingredientsData[key]["amount"],
          title: ingredientsData[key]["title"],
        });
      }

      onSearchIngredient(transformedIngredients);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <form onSubmit={searchIngreientHandler}>
            <input
              name="ingredients_search"
              type="text"
              onChange={(event) => setSearchValue(event.target.value)}
            />
            <button>Search</button>
          </form>
        </div>
      </Card>
    </section>
  );
});

export default Search;
