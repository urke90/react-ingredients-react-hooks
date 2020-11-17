import React, { useState, useEffect } from "react";

import Card from "../../UI/Card/Card";
// import axios from '../../Api/corsIngredientsApi';
import axios from '../../Api/ingredientApi';

import "./Search.css";

const Search = React.memo((props) => {
  const { onSearchIngredient } = props;
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    const getFilteredIngredients = async () => {

      try {
        const query = searchValue.length ? `?orderBy="title"&equalTo="${searchValue}"` : '';
        const response = await axios.get(`/ingredients.json${query}`);
        const ingredientsData = response.data;
        const transformedIngredients = [];

        for (let key in ingredientsData) {
          transformedIngredients.push(ingredientsData[key]);
        }

        onSearchIngredient(transformedIngredients);

      } catch (error) {
        console.log('error', error);
      }
    };

    getFilteredIngredients();

  }, [searchValue, onSearchIngredient]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input type="text" value={searchValue} onChange={(event) => setSearchValue(event.target.value)} />
        </div>
      </Card>
    </section>
  );
});

export default Search;
