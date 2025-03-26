import { useState, useEffect } from "react";

import { useGetIngredientsList } from "@hooks/useIngredientsHooks";
import useIngredientsStore from "@stores/ingredientsStore";

import HomeExpandFilter from "@pages/home/components/HomeExpandFilter";

import Button from "@components/common/button/Button";

import IconFilter from "@assets/icons/IconFilter";
import ArrowUp from "@assets/icons/ArrowUp";

const HomeFilter = () => {
  const { filteredInfomations } = useIngredientsStore();

  const [isExpand, setIsExpand] = useState<boolean>(false);
  const [location, setLocation] = useState<"all" | "refrigeration" | "frozen">("all");

  // 재료 목록을 가져오는 API 호출
  const { refetch: getAllIngredientList } = useGetIngredientsList();

  useEffect(() => {
    if (location === "all") {
      getAllIngredientList();
    }
  }, [location]);

  function handleSaveFilter(): void {
    console.log(filteredInfomations);

    // 필터 저장하는 API 호출

    setIsExpand(false);
  }

  return (
    <div className="relative flex justify-between items-center w-full h-10 px-4">
      <div className="flex justify-start items-center gap-2">
        <Button
          type="button"
          design={location === "all" ? "confirm" : "cancel"}
          content="전체"
          onAction={() => setLocation("all")}
          className="px-2.5 py-1"
        />
        <Button
          type="button"
          design={location === "refrigeration" ? "confirm" : "cancel"}
          content="냉장실"
          onAction={() => setLocation("refrigeration")}
          className="px-2.5 py-1"
        />
        <Button
          type="button"
          design={location === "frozen" ? "confirm" : "cancel"}
          content="냉동실"
          onAction={() => setLocation("frozen")}
          className="px-2.5 py-1"
        />
      </div>
      {!isExpand && <IconFilter width={20} height={20} strokeColor="gray" onClick={() => setIsExpand(true)} />}
      {isExpand && <ArrowUp width={20} height={20} strokeColor="gray" onClick={handleSaveFilter} />}

      {isExpand && <HomeExpandFilter />}
    </div>
  );
};

export default HomeFilter;
