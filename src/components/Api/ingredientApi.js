import axios from "axios";

const instance = axios.create({
  baseURL:
    "https://react-ingredients-app-ho-ed01a.firebaseio.com/",
});

export default instance;
