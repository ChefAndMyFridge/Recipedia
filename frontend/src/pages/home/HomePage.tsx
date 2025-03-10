import HomeHeader from "@pages/home/components/HomeHeader.tsx";
import HomeButtons from "@pages/home/components/HomeButtons.tsx";

import Modal from "@/components/common/modal/Modal";

const HomePage = () => {
  return (
    <>
      <div>
        <HomeHeader />
        <HomeButtons />
      </div>
      <Modal />
    </>
  );
};

export default HomePage;
