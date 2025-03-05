import axios from "axios";

const { VITE_API_URL } = import.meta.env;

const instance = axios.create({
  baseURL: VITE_API_URL, // 프로덕션 환경
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
    "Access-Control-Allow-Origin": "*",
  },
});

export default instance;
