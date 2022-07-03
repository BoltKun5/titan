import axios from "axios";

const baseURL = "http://localhost:10101/api";

export const getToken = () => localStorage.getItem("token")

export const loggedApi = axios.create({
  baseURL,
  headers: {
    "Authorization": `Basic ${getToken()}`,
  },
});

export const api = axios.create({
  baseURL
})
