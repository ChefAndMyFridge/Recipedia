import { Link } from "react-router-dom";

import useIngredientsStore from "@/stores/ingredientsStore";

import Button from "@/components/common/button/Button.tsx";
import HomeSelectedIngredients from "./HomeSelectedIngredients.tsx";

const HomeFooter = () => {
  const { selectedIngredients } = useIngredientsStore();

  return (
    <div className="flex items-center justify-center w-full h-24 px-4 py-2">
      {selectedIngredients && Object.keys(selectedIngredients).length === 0 ? (
        <Link className="flex items-center justify-center w-full h-full" to="/recipeList">
          <Button type="confirm" content="AI에게 레시피 추천받기" />
        </Link>
      ) : (
        <HomeSelectedIngredients />
      )}
    </div>
  );
};

export default HomeFooter;
