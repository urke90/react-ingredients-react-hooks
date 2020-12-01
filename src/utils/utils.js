export const transformIngredients = (fetchedIngredients) => {
  const transformedIngredients = [];

  for (let key in fetchedIngredients) {
    transformedIngredients.push({
      id: key,
      title: fetchedIngredients[key]["title"],
      amount: fetchedIngredients[key]["amount"],
    });
  }
  return transformedIngredients;
};
