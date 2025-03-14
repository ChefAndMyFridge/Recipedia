import { useState } from "react";

import useIngredientsStore from "@stores/ingredientsStore";

import FilterButton from "@components/common/button/FilterButton";

import ArrowDown from "@assets/icons/ArrowDown";

const HomeExpandFilter = () => {
  return (
    <div className="absolute top-full left-0 w-full bg-white shadow-md z-10">
      <div className="flex justify-between items-center w-full h-10 px-4 bg-white">
        <p>필터</p>
      </div>
      <div className="flex justify-between items-center w-full h-10 px-4 bg-white">
        <p>필터</p>
      </div>
      <div className="flex justify-between items-center w-full h-10 px-4 bg-white">
        <p>필터</p>
      </div>
    </div>
  );
};

const HomeFilter = () => {
  const { filteredInfomations, setFilteredInfomations } = useIngredientsStore();

  const [isExpand, setIsExpand] = useState(false);

  return (
    <div
      className="relative flex justify-between items-center w-full h-10 px-4 bg-white cursor-pointer"
      onClick={() => setIsExpand(!isExpand)}
    >
      <div className="flex justify-start items-center gap-2">
        <FilterButton
          isSelected={filteredInfomations["type"].length > 0}
          content="장르"
          count={filteredInfomations["type"].length}
        />
        <FilterButton
          isSelected={filteredInfomations["preference"].length > 0}
          content="선호 재료"
          count={filteredInfomations["preference"].length}
        />
        <FilterButton
          isSelected={filteredInfomations["dislike"].length > 0}
          content="비선호 재료"
          count={filteredInfomations["dislike"].length}
        />
      </div>
      <ArrowDown width={20} height={20} strokeColor="black" />
      {isExpand && <HomeExpandFilter />}
    </div>
  );
};

export default HomeFilter;
