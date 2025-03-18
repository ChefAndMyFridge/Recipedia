import { useState } from "react";
import MenuList from "@pages/recipeList/components/RecipeMenuList";
import Carousel from "@pages/recipeList/components/RecipeCarousel";
import recipeStore from "@/stores/recipeStore";

const RecipeList = () => {
  const { recipeList } = recipeStore();
  const DISHES = recipeList.dishes;
  const VIDEOS = recipeList.videos;

  const [selectedDish, setSelectedDish] = useState<keyof typeof VIDEOS>(DISHES[0]);

  return (
    <section className="h-full flex flex-col">
      <MenuList dishes={DISHES} selectedDish={selectedDish} setSelectedDish={setSelectedDish} />
      <Carousel videos={VIDEOS[selectedDish]} />
    </section>
  );
};

export default RecipeList;
