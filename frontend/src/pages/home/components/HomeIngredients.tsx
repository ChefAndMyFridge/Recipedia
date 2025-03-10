import useIngredientsStore from "@/stores/ingredientsStore.ts";

import HomeIngredient from "@/pages/home/components/HomeIngredient.tsx";

const HomeIngredients = () => {
  const { ingredients } = useIngredientsStore();

  return (
    <div>
      <div className="flex items-start content-start py-1 px-5 gap-y-5 gap-x-2 shrink-0 flex-wrap">
        {ingredients.map((ingredient) => (
          <HomeIngredient key={ingredient.ingredientInfoId} ingredient={ingredient} />
        ))}
      </div>
    </div>
  );
};

export default HomeIngredients;
