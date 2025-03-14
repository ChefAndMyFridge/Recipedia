import { useState } from "react";

import useIngredientsStore from "@stores/ingredientsStore";

import HomeExpandFilter from "@pages/home/components/HomeExpandFilter";

import FilterButton from "@components/common/button/FilterButton";
import ArrowUp from "@assets/icons/ArrowUp";

const HomeFilter = () => {
  const { filteringInfomationKeys, filteredInfomations, setFilteredInfomations, setClearFilteredInfomations } =
    useIngredientsStore();

  const [isExpand, setIsExpand] = useState<false | "type" | "preference" | "dislike">(false);

  return (
    <div className="relative flex justify-between items-center w-full h-10 px-4">
      <div className="flex justify-start items-center gap-2">
        <FilterButton
          isSelected={filteredInfomations["type"].length > 0}
          content="장르"
          count={filteredInfomations["type"].length}
          onAction={() => setIsExpand("type")}
        />
        <FilterButton
          isSelected={filteredInfomations["preference"].length > 0}
          content="선호 식단"
          count={filteredInfomations["preference"].length}
          onAction={() => setIsExpand("preference")}
        />
        <FilterButton
          isSelected={filteredInfomations["dislike"].length > 0}
          content="비선호 식단"
          count={filteredInfomations["dislike"].length}
          onAction={() => setIsExpand("dislike")}
        />
      </div>
      {isExpand !== false && <ArrowUp width={20} height={20} strokeColor="gray" onClick={() => setIsExpand(false)} />}

      {isExpand !== false && (
        <HomeExpandFilter
          filterType={isExpand}
          filteringElems={filteringInfomationKeys[isExpand]}
          filteredElems={filteredInfomations[isExpand]}
          handleFilter={setFilteredInfomations}
          handleClear={setClearFilteredInfomations}
        />
      )}
    </div>
  );
};

export default HomeFilter;
