import axios from "axios";

export const api = axios.create({
  baseURL: "https://saavn.sumit.co/api",
});
