import MenuList from "@/pages/recipeList/components/RecipeMenuList";
import Carousel from "@/pages/recipeList/components/RecipeCarousel";
import RECIPE_LIST from "@/data/RECIPE_LIST";
import { useState } from "react";
import { VideoList } from "@/types/recipeListTypes";

//임의 데이터
const DISHES: string[] = RECIPE_LIST.dishes;
const VIDEOS: VideoList = RECIPE_LIST.videos;

const RecipeList = () => {
  const [selectedDish, setSelectedDish] = useState<keyof typeof VIDEOS>(DISHES[0]);

  return (
    <section className="h-full flex flex-col">
      <MenuList dishes={DISHES} selectedDish={selectedDish} setSelectedDish={setSelectedDish} />
      <Carousel videos={VIDEOS[selectedDish]} />
    </section>
  );
};

export default RecipeList;
