import { useState } from "react";

export const useAddIngredient = (initValue = "") => {
  const [value, setValue] = useState(initValue);

  const changeValueHandler = (e) => {
    setValue(e.target.value);
  };

  return {
    value,
    onChange: changeValueHandler,
  };
};
