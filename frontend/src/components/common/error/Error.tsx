//임시 에러 페이지
const Error = () => {
  return (
    <section className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">오류가 발생했습니다.</h1>
      <p className="text-sm text-gray-500">다시 시도해주세요.</p>
    </section>
  );
};

export default Error;
