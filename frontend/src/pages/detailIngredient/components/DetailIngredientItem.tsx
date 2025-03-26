import { useState } from "react";

import { Ingredient } from "@/types/ingredientsTypes.ts";

import { formatDate } from "@utils/getFormattedDate";

interface IngredientingredientProps {
  ingredient: Ingredient;
  index: number;
}

const DetailIngredientItem = ({ ingredient, index }: IngredientingredientProps) => {
  const [isClicked, setIsClicked] = useState(false);

  const incomingDate = formatDate(new Date(ingredient.incomingDate));
  const expirationDate = formatDate(new Date(ingredient.expirationDate));
  const [remaining, isImminent] = calculateDaysRemaining();

  function calculateDaysRemaining(): [string, boolean] {
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

    let isImminent = false;
    if (diffDays <= 2) {
      isImminent = true;
    }

    return [remaining, isImminent];
  }

  return (
    <>
      <tr
        key={ingredient.ingredientId}
        className={`h-8 font-preRegular ${index > 0 ? "border-t border-gray-300" : ""}`}
        onClick={() => setIsClicked(!isClicked)}
        onBlur={() => setIsClicked(false)}
      >
        <td className={`font-preBold ${isImminent ? "text-error" : "text-primaryDark"}`}>{remaining}</td>
        <td>{incomingDate.slice(0, 13)}</td>
        <td>{expirationDate.slice(0, 13)}</td>
      </tr>
      {isClicked && (
        <tr className="h-7 bg-black/5 font-preRegular text-xs">
          <td className="text-primaryDark font-preBold">{ingredient.storagePlace === "fridge" ? "냉장" : "냉동"}</td>
          <td>{incomingDate.slice(13, 22)}</td>
          <td>{expirationDate.slice(13, 22)}</td>
        </tr>
      )}
    </>
  );
};

export default DetailIngredientItem;
