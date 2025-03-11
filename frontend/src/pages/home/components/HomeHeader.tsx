import HomeHeaderButtons from "@pages/home/components/HomeHeaderButtons.tsx";

const HomeHeader = () => {
  // 나중에 스토어에 날짜 상태 추가할 예정
  function getCurrentDate(): string {
    const date = new Date();

    const year: number = date.getFullYear();
    const month: string = String(date.getMonth() + 1).padStart(2, "0");
    const day: string = String(date.getDate()).padStart(2, "0");

    return `${year}년 ${month}월 ${day}일`;
  }

  const formattedDate: string = getCurrentDate();

  return (
    <div className="flex items-center justify-between px-5 py-3 font-preSemiBold">
      <div>
        <h3>{formattedDate}</h3>
        {/* <p>오늘 날씨</p> */}
      </div>

      <HomeHeaderButtons />
    </div>
  );
};

export default HomeHeader;
