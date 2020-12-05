import React, { useCallback, useEffect, useState } from "react";

import Card from "../../UI/Card/Card";
import useHttp from "../../../hooks/http";
import ErrorModal from "../../UI/ErrorModal/ErrorModal";
import { transformIngredients } from "../../../utils/utils";

import "./Search.css";

const Search = React.memo(({ onSearchIngredient }) => {
  const [searchValue, setSearchValue] = useState("");

  const { error, responseData, sendRequest, clearErrorHandler } = useHttp();

  useEffect(() => {
    const transformedIngredients = transformIngredients(responseData);
    onSearchIngredient(transformedIngredients);
  }, [responseData, onSearchIngredient]);

  // get ingredient by title from database when user submits form
  const searchIngreientHandler = async (event) => {
    event.preventDefault();
    console.log("searchIngreientHandler SEARCH");

    const query = searchValue.length
      ? `?orderBy="title"&equalTo="${searchValue}"`
      : "";

    sendRequest("GET", `/ingredients.json${query}`);
  };

  return (
    <section className="search">
      {error && <ErrorModal onClose={clearErrorHandler}>{error}</ErrorModal>}
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <form onSubmit={searchIngreientHandler}>
            <input
              name="ingredients_search"
              type="text"
              value={searchValue}
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
