import axios from 'axios';

const instance = axios.create({
  baseURL: "https://cors-anywhere.herokuapp.com/https://react-ingredients-app-ho-ed01a.firebaseio.com/"
});

export default instance;