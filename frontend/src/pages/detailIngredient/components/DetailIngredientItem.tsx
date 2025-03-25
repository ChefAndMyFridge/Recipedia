import React, { useState } from "react";

import { Ingredient } from "@/types/ingredientsTypes.ts";

import DetailIngredientInfo from "@pages/detailIngredient/components/DetailIngredientInfo.tsx";

interface IngredientItemProps {
  ingredient: Ingredient;
  imgSrc: string;
}

const DetailIngredientItem = ({ ingredient, imgSrc }: IngredientItemProps) => {
  const [isClicked, setIsClicked] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // 남은 만료일 계산
  function calculateDaysRemaining() {
    const today = new Date();
    const expirationDate = new Date(ingredient.expirationDate);

    const diffTime = expirationDate.getTime() - today.getTime();

    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    let remaining = "";
    if (diffDays < 0) {
      remaining = "D+" + String(diffDays).slice(1);
    } else if (diffDays === 0) {
      remaining = "D-Day";
    } else {
      remaining = "D-" + String(diffDays);
    }

    return remaining;
  }

  function handleClick(event: React.MouseEvent<HTMLDivElement>) {
    setIsClicked(true);
    setPosition({ x: window.innerWidth / 2, y: event.clientY });

    const timer = setTimeout(() => {
      handleBlur();
    }, 5000);

    return () => clearTimeout(timer);
  }

  function handleBlur() {
    setIsClicked(false);
    setPosition({ x: 0, y: 0 });
  }

  const daysRemaining = calculateDaysRemaining();

  return (
    <div className="flex flex-col w-1/5 h-fit p-1 justify-center items-center cursor-pointer">
      <div
        className="relative w-full p-1 aspect-[1/1] rounded-3xl"
        tabIndex={0}
        onClick={handleClick}
        onBlur={handleBlur}
      >
        <img src={imgSrc} alt={imgSrc} className="w-full h-full object-cover rounded-3xl" />
        <span className="absolute right-0 top-0 bg-error text-white text-xs px-2 py-1 rounded-3xl">
          {daysRemaining}
        </span>
        {isClicked && <DetailIngredientInfo ingredient={ingredient} position={position} />}
      </div>
    </div>
  );
};

export default DetailIngredientItem;
