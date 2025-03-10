import HomeHeader from "@pages/home/components/HomeHeader.tsx";
import HomeIngredients from "./components/HomeIngredients.tsx";

import Modal from "@/components/common/modal/Modal";

const HomePage = () => {
  return (
    <>
      <div>
        <HomeHeader />
        <HomeIngredients />
      </div>
      <Modal />
    </>
  );
};

export default HomePage;
