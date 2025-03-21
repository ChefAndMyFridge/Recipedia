import { useState, useEffect } from "react";

import useIngredientsStore from "@stores/ingredientsStore";
import { useGetIngredientsList } from "@hooks/useIngredientsHooks";

import HomeExpandFilter from "@pages/home/components/HomeExpandFilter";

import Button from "@components/common/button/Button";
import ArrowUp from "@assets/icons/ArrowUp";

const HomeFilter = () => {
  const { filteringInfomationKeys, filteredInfomations, setFilteredInfomations, setClearFilteredInfomations } =
    useIngredientsStore();

  const [isExpand, setIsExpand] = useState<false | "type" | "preference" | "dislike">(false);
  const [location, setLocation] = useState<"all" | "refrigeration" | "frozen">("all");

  // 재료 목록을 가져오는 API 호출
  const { refetch } = useGetIngredientsList();

  useEffect(() => {
    refetch();
  }, [location]);

  return (
    <div className="relative flex justify-between items-center w-full h-10 px-4">
      <div className="flex justify-start items-center gap-2">
        <Button
          type="button"
          design={location === "all" ? "confirm" : "cancel"}
          content="전체"
          onAction={() => setLocation("all")}
          className="px-2 py-1"
        />
        <Button
          type="button"
          design={location === "refrigeration" ? "confirm" : "cancel"}
          content="냉장실"
          onAction={() => setLocation("refrigeration")}
          className="px-2 py-1"
        />
        <Button
          type="button"
          design={location === "frozen" ? "confirm" : "cancel"}
          content="냉동실"
          onAction={() => setLocation("frozen")}
          className="px-2 py-1"
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
