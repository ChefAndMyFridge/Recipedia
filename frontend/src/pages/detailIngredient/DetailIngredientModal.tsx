import { useState } from "react";

import { Ingredients, Ingredient } from "@/types/ingredientsTypes.ts";

import useModalStore from "@stores/modalStore";

import DetailIngredientImage from "@pages/detailIngredient/components/DetailIngredientImage.tsx";
import DetailIngredientItem from "@pages/detailIngredient/components/DetailIngredientItem.tsx";
import DetailIngredientInfo from "@pages/detailIngredient/components/DetailIngredientInfo.tsx";

import Button from "@components/common/button/Button";

import noImg from "@assets/images/noIngredient/carrot.png";

interface IngredientsProps {
  ingredient: Ingredients;
}

const DetailIngredientModal = ({ ingredient }: IngredientsProps) => {
  const { closeModal } = useModalStore();

  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);

  function handleOpenDetailInfo(ingredient: Ingredient) {
    setIsExpanded(true);
    setSelectedIngredient(ingredient);

    const timer = setTimeout(() => {
      handleCloseDetailInfo();
    }, 5000);

    return () => clearTimeout(timer);
  }

  function handleCloseDetailInfo() {
    setIsExpanded(false);
    setSelectedIngredient(null);
  }

  return (
    <div className="relative">
      <DetailIngredientImage
        imgSrc={ingredient.imageUrl ? ingredient.imageUrl : noImg}
        ingredientId={ingredient.ingredientInfoId}
      />
      {isExpanded && selectedIngredient !== null && <DetailIngredientInfo ingredient={selectedIngredient} />}

      {/* 선택된 식재료 현황 */}
      <div className="flex justify-between items-center w-full h-14 px-6 py-2 font-preSemiBold">
        <h1 className="m-0 text-xl">{ingredient.name}</h1>
        <h1 className="m-0 text-xl">{ingredient.totalCount}개</h1>
      </div>

      {/* 선택된 식재료 상세 목록  */}
      <div className="w-full h-fit px-2">
        <div className="flex h-[35vh] max-h-[35vh] items-start content-start py-2 px-4 gap-y-5 shrink-0 flex-wrap font-preMedium bg-[#EEE] rounded-xl overflow-y-auto">
          {ingredient.ingredients &&
            ingredient.ingredients.map((item) => (
              <DetailIngredientItem
                key={item.ingredientId}
                ingredient={item}
                imgSrc={ingredient.imageUrl ? ingredient.imageUrl : noImg}
                onOpen={handleOpenDetailInfo}
                onClose={handleCloseDetailInfo}
              />
            ))}
        </div>
      </div>

      <div className="flex justify-end align-center px-4 py-4 gap-2">
        <Button type="button" design="confirm" content="닫기" onAction={closeModal} className="w-24 h-10"></Button>
      </div>
    </div>
  );
};

export default DetailIngredientModal;
