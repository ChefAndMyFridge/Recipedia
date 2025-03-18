import { useState } from "react";
import MenuList from "@pages/recipeList/components/RecipeMenuList";
import Carousel from "@pages/recipeList/components/RecipeCarousel";
import recipeStore from "@/stores/recipeStore";
import ErrorPage from "@/components/common/error/ErrorPage";

const RecipeList = () => {
  const { recipeList } = recipeStore();
  const DISHES = recipeList.dishes;
  const VIDEOS = recipeList.videos;

  console.log(recipeList);
  const [selectedDish, setSelectedDish] = useState<keyof typeof VIDEOS>(DISHES[0]);

  return (
    <section className="h-full flex flex-col">
      <MenuList dishes={DISHES} selectedDish={selectedDish} setSelectedDish={setSelectedDish} />
      {VIDEOS && VIDEOS[selectedDish].length > 0 ? <Carousel videos={VIDEOS[selectedDish]} /> : <ErrorPage />}
    </section>
  );
};

export default RecipeList;
