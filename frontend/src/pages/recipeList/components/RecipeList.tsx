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

  const videos = {
    "소고기 볶음": [
      {
        title: "지금 당장 소고기사서 만들어보세요! 밥도둑 소고기 볶음",
        url: "https://www.youtube.com/watch?v=_yl05thA1Dw",
        relevance_score: 1,
      },
      {
        title: "미친 소고기 볶음, 만드는데 20분 (몽골리안비프)",
        url: "https://www.youtube.com/watch?v=8Dkp3r02mqs",
        relevance_score: 0.8,
      },
      {
        title: "소고기 볶음 요리 중 무조건 1등 #몽골리안비프",
        url: "https://www.youtube.com/watch?v=YY3dXcXT50Y",
        relevance_score: 0.8,
      },
    ],
    "소고기 덮밥": [
      {
        title: "소고기 덮밥1",
        url: "https://www.youtube.com/watch?v=_yl05thA1Dw",
        relevance_score: 1,
      },
      {
        title: "소고기 덮밥2",
        url: "https://www.youtube.com/watch?v=8Dkp3r02mqs",
        relevance_score: 0.8,
      },
      {
        title: "소고기 덮밥3",
        url: "https://www.youtube.com/watch?v=YY3dXcXT50Y",
        relevance_score: 0.8,
      },
    ],
    "소고기 계란찜": [
      {
        title: "소고기 계란찜1",
        url: "https://www.youtube.com/watch?v=_yl05thA1Dw",
        relevance_score: 1,
      },
      {
        title: "소고기 계란찜2",
        url: "https://www.youtube.com/watch?v=8Dkp3r02mqs",
        relevance_score: 0.8,
      },
      {
        title: "소고기 계란찜3",
        url: "https://www.youtube.com/watch?v=YY3dXcXT50Y",
        relevance_score: 0.8,
      },
    ],
    "소고기 양파스튜": [
      {
        title: "소고기 양파스튜1",
        url: "https://www.youtube.com/watch?v=_yl05thA1Dw",
        relevance_score: 1,
      },
      {
        title: "소고기 양파스튜2",
        url: "https://www.youtube.com/watch?v=8Dkp3r02mqs",
        relevance_score: 0.8,
      },
      {
        title: "소고기 양파스튜3",
        url: "https://www.youtube.com/watch?v=YY3dXcXT50Y",
        relevance_score: 0.8,
      },
    ],
  };

  return (
    <section className="flex flex-col h-[80%]">
      <MenuList dishes={DISHES} />
      <Carousel videos={videos["소고기 볶음"]} />
    </section>
  );
};

export default RecipeList;
