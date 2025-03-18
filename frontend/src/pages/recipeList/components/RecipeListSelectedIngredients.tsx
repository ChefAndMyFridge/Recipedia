import { useParams } from "react-router-dom";
import useIngredientsStore from "@/stores/ingredientsStore";

const RecipeListSelectedIngredients = () => {
  const { recommendType } = useParams();
  const IngredientTitle = recommendType === "AI" ? "AI가 직접 재료를 선택했어요" : "직접 선택한 재료";

  const { selectedIngredients } = useIngredientsStore();
  console.log("selectedIngredients ", Object.values(selectedIngredients));

  return (
    <div className="sticky bottom-0 flex flex-col w-full gap-2 px-5 font-preMedium text-base text-content">
      <p>{IngredientTitle}</p>
      <hr className="border-content" />
      <div className="flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
        {Object.values(selectedIngredients).map((ingredient) => (
          <div key={ingredient.ingredientInfoId} className="flex-shrink-0">
            <img src={ingredient.imageUrl} alt={ingredient.name} className="w-12 h-12 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeListSelectedIngredients;
