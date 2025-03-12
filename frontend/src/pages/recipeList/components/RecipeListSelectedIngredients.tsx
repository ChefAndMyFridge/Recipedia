import { INGREDIENTS } from "@/data/INGREDIENTS";
import { Ingredients } from "@/types/ingredientsTypes";

const SelectedIngredients = () => {
  //사용자 선택 재료 (추후 데이터 변경)
  const selectedIngredients: Ingredients[] = INGREDIENTS;
  return (
    <div className="sticky bottom-0 flex flex-col w-full gap-2 px-5 font-preMedium text-base text-content">
      <p>직접 선택한 재료</p>
      <hr className="border-content" />
      <div className="flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
        {selectedIngredients.map((ingredient) => (
          <div key={ingredient.ingredientInfoId} className="flex-shrink-0">
            <img src={ingredient.imageUrl} alt={ingredient.name} className="w-12 h-12 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectedIngredients;
