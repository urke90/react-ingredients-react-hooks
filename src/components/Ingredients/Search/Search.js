import React, { useCallback, useEffect, useState } from "react";

import Card from "../../UI/Card/Card";
import { useHttp } from "../../../hooks/useHttp";
import ErrorModal from "../../UI/ErrorModal/ErrorModal";
import { transformIngredients } from "../../../utils/utils";
import { useChangeStateValue } from "../../../hooks/useChangeStateValue";

import "./Search.css";

const Search = React.memo(({ onSearchIngredient }) => {
  const search = useChangeStateValue("");

  const { error, responseData, sendRequest, clearErrorHandler } = useHttp();

  useEffect(() => {
    const transformedIngredients = transformIngredients(responseData);
    onSearchIngredient(transformedIngredients);
  }, [responseData, onSearchIngredient]);

  // get ingredient by title from database when user submits form
  const searchIngreientHandler = async (event) => {
    event.preventDefault();
    console.log("searchIngreientHandler SEARCH");

    const query = search.value.length
      ? `?orderBy="title"&equalTo="${search.value}"`
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
            <input name="ingredients_search" type="text" {...search} />
            <button>Search</button>
          </form>
        </div>
      </Card>
    </section>
  );
});

export default Search;
