import React from "react";

import { useNavigate } from "react-router-dom";

import { authLoginApi } from "@apis/userApi";

import Input from "@components/common/input/Input.tsx";
import Button from "@components/common/button/Button.tsx";

const Login = () => {
  const navigate = useNavigate();

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    console.log("로그인 데이터:", data);

    try {
      const { username, password } = data as { username: string; password: string };
      const response = await authLoginApi(username, password);

      if (response) {
        console.log("로그인 성공:", response);
        navigate("/"); // 로그인 성공 후 홈으로 이동
      }
    } catch (error) {
      console.error("로그인 실패:", error);
      alert("로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.");
    }
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="flex flex-col items-center justify-center w-full max-w-sm p-4 bg-white rounded-lg shadow-md"
      >
        <h1 className="text-2xl font-bold mb-4">로그인</h1>
        <Input label="아이디" name="username" type="text" placeHolder="아이디를 입력해주세요." />
        <Input label="비밀번호" name="password" type="password" placeHolder="비밀번호를 입력해주세요." />
        <Button type="submit" design="confirm" content="로그인" />
      </form>
    </div>
  );
};

export default Login;
