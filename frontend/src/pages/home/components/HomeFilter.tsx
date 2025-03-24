import { useState, useEffect } from "react";

import { useGetIngredientsList } from "@hooks/useIngredientsHooks";
import useIngredientsStore from "@stores/ingredientsStore";

import HomeExpandFilter from "@pages/home/components/HomeExpandFilter";

import Button from "@components/common/button/Button";

import IconSort from "@assets/icons/IconSort";
import IconFilter from "@assets/icons/IconFilter";
import ArrowUp from "@assets/icons/ArrowUp";

const HomeFilter = () => {
  const { filteredInfomations } = useIngredientsStore();

  const [sort, setSort] = useState<"name" | "expirationDate">("name");

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
      <div className="flex justify-end items-center gap-2 font-preMedium text-sm text-gray-500">
        <div
          className="flex justify-center items-center gap-1 cursor-pointer"
          onClick={() => setSort(sort === "name" ? "expirationDate" : "name")}
        >
          <IconSort width={18} height={18} strokeColor="#0381fe" />
          <p className="text-primary">{sort === "name" ? "이름순" : "만료일순"}</p>
        </div>
        <div className="border-r border-[#dddddd] h-5 mx-1" />

        {!isExpand && <IconFilter width={18} height={18} strokeColor="#9d9d9d" onClick={() => setIsExpand(true)} />}
        {isExpand && <ArrowUp width={18} height={18} strokeColor="#9d9d9d" onClick={handleSaveFilter} />}
      </div>

      {isExpand && <HomeExpandFilter />}
    </div>
  );
};

export default HomeFilter;
