import axios from "axios";

const API = axios.create({
  baseURL: "https://fitflow-iw0j.onrender.com/api",
});

export default API;