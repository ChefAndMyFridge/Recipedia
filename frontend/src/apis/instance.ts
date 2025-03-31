import axios from "axios";

// const { VITE_API_URL } = import.meta.env;

const base = import.meta.env.BASE_URL;
console.log("base", base);
const baseURL = base.startsWith("/master") ? "https://j12s003.p.ssafy.io/master/api" : "https://j12s003.p.ssafy.io/api";

const instance = axios.create({
  // baseURL: VITE_API_URL, // 프로덕션 환경
  baseURL,
  // withCredentials: true, // 쿠키를 포함한 요청을 보낼 수 있도록 설정
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
    "Access-Control-Allow-Origin": "*",
  },
});

export default instance;
