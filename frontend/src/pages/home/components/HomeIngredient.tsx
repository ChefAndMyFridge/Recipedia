import { useState, useEffect } from "react";

import useIngredientsStore from "@stores/ingredientsStore.ts";
import useModalStore from "@stores/modalStore";

import { Ingredients } from "@/types/ingredientsTypes";

import DetailIngredientModal from "@pages/detailIngredient/DetailIngredientModal";

import IconDecrease from "@assets/icons/IconDecrease";
import IconIncrease from "@assets/icons/IconIncrease";

interface HomeIngredientProps {
  ingredient: Ingredients;
}

const HomeIngredient = ({ ingredient }: HomeIngredientProps) => {
  const { selectedIngredients, setSelectedCount } = useIngredientsStore();
  const { openModal } = useModalStore();

  const selectedIngredient = selectedIngredients[ingredient.ingredientInfoId];
  const [count, setCount] = useState<number>(selectedIngredient?.selectedCount || 0);

  useEffect(() => {
    setCount(selectedIngredients[ingredient.ingredientInfoId]?.selectedCount || 0);
  }, [selectedIngredients]);

  const handleIncrease = () => {
    if (count < ingredient.totalCount) {
      setCount(count + 1);
      setSelectedCount(ingredient.ingredientInfoId, {
        ingredientInfoId: ingredient.ingredientInfoId,
        name: ingredient.name,
        imageUrl: ingredient.imageUrl,
        selectedCount: count + 1,
      });
    }
  };

  const handleDecrease = () => {
    if (count > 0) {
      setCount(count - 1);
      setSelectedCount(ingredient.ingredientInfoId, {
        ingredientInfoId: ingredient.ingredientInfoId,
        name: ingredient.name,
        imageUrl: ingredient.imageUrl,
        selectedCount: count - 1,
      });
    }
  };

  return (
    <div className="flex flex-col w-full h-fit p-1 justify-center items-center ">
      {/* 아이콘 부분 */}
      <div
        className="relative w-full aspect-[1/1] rounded-3xl cursor-pointer bg-subContent"
        onClick={() => openModal(<DetailIngredientModal ingredient={ingredient} />)}
      >
        <img src={ingredient.imageUrl} alt="no image" className="w-full h-full object-cover rounded-3xl" />
        <p className="absolute bottom-0.5 w-full font-preMedium text-xs text-center">{ingredient.name}</p>
      </div>

      {/* 재료 조작 관련 부분 */}
      <div className="flex w-full justify-between items-center p-1">
        <button
          disabled={count <= 0}
          onClick={handleDecrease}
          className="flex justify-center items-center w-3.5 aspect-[1/1] p-[2px] bg-subContent rounded-full"
        >
          <IconDecrease strokeColor="black" />
        </button>
        <span className="font-preSemiBold text-center">{count}</span>
        <button
          disabled={count >= ingredient.totalCount}
          onClick={handleIncrease}
          className="flex justify-center items-center w-3.5 aspect-[1/1] p-[2px] bg-subContent rounded-full"
        >
          <IconIncrease strokeColor="black" />
        </button>
      </div>
    </div>
  );
};

export default HomeIngredient;
