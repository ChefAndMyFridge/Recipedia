import { useState } from "react";
import MenuList from "@pages/recipeList/components/RecipeMenuList";
import Carousel from "@pages/recipeList/components/RecipeCarousel";
import recipeStore from "@/stores/recipeStore";
import ErrorPage from "@/components/common/error/ErrorPage";

const RecipeList = () => {
  const { recipeList } = recipeStore();
  const DISHES = recipeList.dishes.length > 0 ? recipeList.dishes : ["레시피가 없습니다"];
  const VIDEOS = recipeList.videos;

  const [selectedDish, setSelectedDish] = useState<keyof typeof VIDEOS | string>(DISHES[0]);

  return (
    <section className="h-full flex flex-col">
      <MenuList dishes={DISHES} selectedDish={selectedDish} setSelectedDish={setSelectedDish} />
      {VIDEOS && VIDEOS[selectedDish] && VIDEOS[selectedDish].length > 0 ? (
        <Carousel videos={VIDEOS[selectedDish]} />
      ) : (
        <ErrorPage />
      )}
    </section>
  );
};

export default RecipeList;
