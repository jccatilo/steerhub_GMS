import axios from "axios";

const api = axios.create({
  baseURL: "https://api-ligtas.parallaxed.ph", // Replace with your backend URL if needed
  timeout: 5000,
  headers: { "Content-Type": "application/json" },
});

export default api;
