import React, { useEffect, useState, useRef } from "react";

import useIngredientsStore from "@stores/ingredientsStore.ts";
import { useGetIngredientsList } from "@hooks/useIngredientsHooks";

import HomeIngredient from "@pages/home/components/HomeIngredient.tsx";

const ITEM_PER_PAGE = 25;

const HomeIngredients = () => {
  const { ingredients } = useIngredientsStore();

  const [pageIndex, setPageIndex] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);

  const touchStartX = useRef(0);
  const touchMoveX = useRef(0);

  // 고내에 저장된 재료 목록 조회
  useGetIngredientsList();

  useEffect(() => {
    setPageIndex(0);
  }, [ingredients]);

  const totalPages =
    Array.isArray(ingredients) && ingredients.length > 0 ? Math.ceil(ingredients.length / ITEM_PER_PAGE) : 1;
  const pagination = Array.from({ length: totalPages });

  // 페이지 이동
  function handlePrevPage() {
    setPageIndex((page) => Math.max(page - 1, 0));
  }

  function handleNextPage() {
    setPageIndex((page) => Math.min(page + 1, totalPages - 1));
  }

  // 터치 시작
  function handleTouchStart(event: React.TouchEvent) {
    touchStartX.current = event.touches[0].clientX;
    touchMoveX.current = event.touches[0].clientX;
    setIsSwiping(true);
  }

  // 터치 이동
  function handleTouchMove(event: React.TouchEvent) {
    touchMoveX.current = event.touches[0].clientX;
  }

  // 터치 종료
  function handleTouchEnd() {
    setIsSwiping(false);
    const deltaX = touchStartX.current - touchMoveX.current;

    if (deltaX > 50 && pageIndex < totalPages - 1) {
      handleNextPage();
    } else if (deltaX < -50 && pageIndex > 0) {
      handlePrevPage();
    }
  }

  if (ingredients && ingredients.length === 0) {
    return (
      <div className="flex justify-center items-center w-full h-full">
        <p className="text-lg text-content">등록된 재료가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between items-center w-full h-full px-4 py-2 overflow-hidden">
      {/* 터치 이동이 가능한 슬라이드 영역 */}
      <div
        className="flex justify-between items-start w-full h-[95%] transition-transform duration-300 ease-out will-change-transform"
        style={{
          transform: `translateX(calc(-${pageIndex * 100}% + ${isSwiping ? touchMoveX.current - touchStartX.current : 0}px))`,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {pagination &&
          pagination.map((_, idx) => {
            const startIdx = idx * ITEM_PER_PAGE;
            const endIdx = startIdx + ITEM_PER_PAGE;
            return (
              <div key={idx} className="w-full flex-shrink-0 grid grid-cols-5 gap-2">
                {ingredients &&
                  ingredients
                    .slice(startIdx, endIdx)
                    .map((ingredient) => <HomeIngredient key={ingredient.ingredientInfoId} ingredient={ingredient} />)}
              </div>
            );
          })}
      </div>

      {/* 페이지네이션 */}
      <div className="flex justify-center items-end gap-1.5 h-[5%]">
        {pagination &&
          pagination.map((_, idx) => (
            <span
              key={idx}
              className={`rounded-full transition-all ${idx === pageIndex ? "w-2 h-2 bg-primary" : "w-1.5 h-1.5  bg-content"}`}
              onClick={() => setPageIndex(idx)}
            />
          ))}
      </div>
    </div>
  );
};

export default HomeIngredients;
