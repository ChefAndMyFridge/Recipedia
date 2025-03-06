import HomeButton from "./HomeButton.tsx";

const HomeButtons = () => {
  return (
    <div className="flex w-full px-5 flex-col justify-center items-center gap-4">
      <div className="flex w-full h-fit flex-row justify-between items-center gap-4">
        <HomeButton title="입고" />
        <HomeButton title="출고" />
      </div>
      <div className="flex w-full h-fit flex-row justify-between items-center gap-4">
        <HomeButton title="재료 리스트" link="123" />
        <HomeButton title="레시피 탐색" />
        <HomeButton title="즐겨찾기" />
      </div>
    </div>
  );
};

export default HomeButtons;
