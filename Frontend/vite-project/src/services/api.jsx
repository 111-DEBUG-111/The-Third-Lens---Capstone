import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5001/api", // change later when deployed
});

export default API;
