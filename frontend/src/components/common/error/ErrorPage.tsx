import IconError from "@/assets/icons/IconError";
import Button from "../button/Button";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();
  return (
    <section className="flex flex-col gap-20 items-center justify-around h-screen">
      <div className="flex flex-col gap-8 items-center justify-center">
        <IconError width={120} height={120} />
        <div className="flex flex-col gap-4 items-center justify-center">
          <h1 className="text-2xl font-preBold">일시적인 오류입니다.</h1>
          <p className="text-base font-preMedium text-content2">잠시 후에 다시 시도해주세요.</p>
        </div>
      </div>
      <Button
        type="button"
        design="confirm"
        content="홈으로"
        className="w-[90%] h-10"
        onAction={() => {
          navigate("/");
        }}
      />
    </section>
  );
};

export default ErrorPage;
