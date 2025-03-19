//임시 에러 페이지
const ErrorPage = () => {
  return (
    <section className="flex flex-col gap-3 items-center justify-center h-screen">
      <h1 className="text-2xl font-preBold">오류가 발생했습니다.</h1>
      <p className="text-base font-preMedium text-content2">잠시 후, 다시 시도해주세요.</p>
    </section>
  );
};

export default ErrorPage;
