import axios from "axios";

const { VITE_API_URL } = import.meta.env;

const instance = axios.create({
  // baseURL: VITE_API_URL, // 프로덕션 환경
  VITE_API_URL,
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
    "Access-Control-Allow-Origin": "*",
  },
});

// 요청 인터셉터: JWT 토큰을 요청 헤더에 추가
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터: 토큰이 만료되었거나 없으면 로그인 페이지로 이동
instance.interceptors.response.use(
  (response) => response, // 정상 응답은 그대로 반환
  (error) => {
    if (error.response && error.response.status === 403) {
      console.warn("인증 실패, 로그인 페이지로 이동합니다.");

      localStorage.removeItem("jwt"); // 로컬 스토리지에서 토큰 삭제
      window.location.href = "/login"; // 로그인 페이지로 강제 이동
    }
    return Promise.reject(error);
  }
);

export default instance;
