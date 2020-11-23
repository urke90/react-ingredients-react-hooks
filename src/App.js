import React, { useContext } from "react";

import Ingredients from "./components/Ingredients/Ingredients";
import Auth from "./Auth/Auth";
import { AuthContext } from "./context/auth-context";

const App = (props) => {
  const authContext = useContext(AuthContext);
  console.log("authContext", authContext);

  let content = <Auth />;

  if (authContext.isAuth) {
    content = <Ingredients />;
  }

  return content;
};

export default App;
