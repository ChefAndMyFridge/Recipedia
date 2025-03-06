import useModalStore from "@/stores/modalStore.ts";

import HomeButton from "@/pages/home/components/HomeButton.tsx";

import TestModal from "@/pages/home/TestModal.tsx";

const HomeButtons = () => {
  const { openModal } = useModalStore();

  return (
    <div className="flex w-full mt-[25%] px-5 flex-col justify-center items-center gap-3">
      <div className="flex w-full h-fit flex-row justify-between items-center gap-3">
        <HomeButton title="입고" onAction={() => openModal(<TestModal />)} />
        <HomeButton title="출고" />
      </div>
      <div className="flex w-full h-fit flex-row justify-between items-center gap-3">
        <HomeButton title="재료 리스트" link="123" />
        <HomeButton title="레시피 탐색" />
        <HomeButton title="즐겨찾기" />
      </div>
    </div>
  );
};

export default HomeButtons;
