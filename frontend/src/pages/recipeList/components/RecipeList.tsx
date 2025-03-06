import MenuList from "@pages/recipeList/components/MenuList";
import Carousel from "@pages/recipeList/components/Carousel";

const RecipeList = () => {
  //임의 데이터
  const DISHES = [
    "소고기 볶음",
    "소고기 덮밥",
    "소고기 계란찜",
    "소고기 양파스튜",
    "소고기 무침",
    "소고기 구이",
    "소고기 갈비",
  ];

  return (
    <section className="flex flex-col h-[80%]">
      <MenuList dishes={DISHES} />
      <Carousel />
    </section>
  );
};

export default RecipeList;
