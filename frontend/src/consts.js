const DEBUG = process.env.REACT_APP_DEBUG === "true";
const baseURL = DEBUG
  ? "http://localhost:5000"
  : "https://online-connect4.herokuapp.com";

export { baseURL };
