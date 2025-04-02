import "@pages/auth/auth.css";

import React, { useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { useLogin } from "@hooks/useUserHook";
import useUserStore from "@stores/userStore";

import Input from "@components/common/input/Input.tsx";
import Button from "@components/common/button/Button.tsx";

import logo from "@assets/images/logo/recipediaLogo.png";

const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useUserStore();
  const { mutate: login, isPending } = useLogin();

  useEffect(() => {
    // 이미 인증된 상태라면 홈으로 리다이렉트
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const { username, password } = data as { username: string; password: string };
    
    login({ username, password }, {
      onSuccess: () => {
        // 로그인 성공 시 홈으로 이동 (onSuccess 콜백이 완료된 후에 실행됨)
        console.log("로그인 성공 in loginpage");
        navigate("/");
      },
      onError: (error) => {
        console.error("로그인 실패 in loginpage :", error);
      }
    });
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-12">
      <div className="w-48 h-fit flex flex-col items-center justify-center slide-down">
        {/* 추후 파비콘 이미지 사용 예정 */}
        <img src={logo} alt="" className="w-48 h-48 aspect-[1/1] object-cover mb-4" />
        <h1 className="text-2xl font-bold font-preBold">RECIPEDIA</h1>
      </div>

      <form
        onSubmit={handleLogin}
        className="flex flex-col items-center justify-center w-4/5 gap-6 p-5 bg-white shadow-md rounded-xl"
      >
        <div className="flex flex-col items-center justify-center w-full gap-4">
          <Input label="아이디" name="username" type="text" placeHolder="아이디를 입력해주세요." />
          <Input label="비밀번호" name="password" type="password" placeHolder="비밀번호를 입력해주세요." />
        </div>
        <Button 
          type="submit" 
          design="confirm" 
          content={isPending ? "로그인 중..." : "로그인"} 
          className="w-full h-10"
        />
      </form>
    </div>
  );
};

export default Login;
