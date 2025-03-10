import HomeHeader from "@pages/home/components/HomeHeader.tsx";
import HomeIngredients from "@pages/home/components/HomeIngredients.tsx";
import HomeFooter from "@pages/home/components/HomeFooter.tsx";

import Modal from "@/components/common/modal/Modal";

const HomePage = () => {
  return (
    <>
      <div className="flex flex-col justify-between w-full h-[100vh]">
        <HomeHeader />
        <HomeIngredients />
        <HomeFooter />
      </div>
      <Modal />
    </>
  );
};

export default HomePage;
