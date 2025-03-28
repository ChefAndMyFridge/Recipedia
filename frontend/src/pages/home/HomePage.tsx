import { useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

import HomeHeader from "@pages/home/components/HomeHeader.tsx";
import HomeFilter from "@pages/home/components/HomeFilter";
import HomeIngredients from "@pages/home/components/HomeIngredients.tsx";
import HomeFooter from "@pages/home/components/HomeFooter.tsx";

import ErrorPage from "@components/common/error/ErrorPage";
import Modal from "@components/common/modal/Modal";
import Timer from "@components/common/timer/Timer";

const HomePage = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <ErrorBoundary FallbackComponent={ErrorPage}>
      <div className="flex flex-col justify-between w-full h-full">
        <HomeHeader />
        <HomeFilter isFilterOpen={isFilterOpen} handleFilterOpen={setIsFilterOpen} />
        <HomeIngredients isFilterOpen={isFilterOpen} />
        <HomeFooter isFilterOpen={isFilterOpen} />
      </div>
      <Modal />
      <Timer />
    </ErrorBoundary>
  );
};

export default HomePage;
