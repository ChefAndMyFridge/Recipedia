import axios from "axios";

const { VITE_API_URL } = import.meta.env;

const instance = axios.create({
  baseURL: VITE_API_URL, // 프로덕션 환경
  withCredentials: true, // 쿠키 및 인증 정보 포함
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
    "Access-Control-Allow-Origin": "*",
  },
});

export default instance;
