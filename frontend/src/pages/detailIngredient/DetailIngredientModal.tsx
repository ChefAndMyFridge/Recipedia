import { Ingredients } from "@/types/ingredientsTypes.ts";

import useModalStore from "@stores/modalStore";

import DetailIngredientImage from "@pages/detailIngredient/components/DetailIngredientImage.tsx";
import DetailIngredientItem from "@pages/detailIngredient/components/DetailIngredientItem.tsx";

import Button from "@components/common/button/Button";

interface IngredientsProps {
  ingredient: Ingredients;
}

const DetailIngredientModal = ({ ingredient }: IngredientsProps) => {
  const { closeModal } = useModalStore();

  return (
    <div>
      <DetailIngredientImage imgSrc={ingredient.imageUrl} />

      <div className="flex justify-between items-center w-full h-10 px-4 py-4">
        <p>{ingredient.name}</p>
        <p>{ingredient.totalCount}</p>
      </div>

      <div className="flex h-[40vh] items-start content-start py-1 px-5 gap-y-5 shrink-0 flex-wrap font-preMedium bg-[#EEE] rounded-xl">
        {ingredient.ingredients.map((item) => (
          <DetailIngredientItem key={item.ingredientId} ingredient={item} imgSrc={ingredient.imageUrl} />
        ))}
      </div>

      <div className="flex justify-end align-center px-4 py-4 gap-2">
        <Button type="button" design="confirm" content="닫기" onAction={closeModal} className="w-24 h-10"></Button>
      </div>
    </div>
  );
};

export default DetailIngredientModal;
