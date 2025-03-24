import { useState } from "react";
import { Video } from "@/types/recipeListTypes";
import MyRecipeItem from "@pages/myRecipe/components/MyRecipeItem";
import NoMyRecipeList from "@pages/myRecipe/components/NoMyRecipeList";

//임의 데이터 리스트, 추후 API 연결 시 삭제 예정
// const DATA_RECIPE_LIST = [
//   {
//     recipeId: 1,
//     title:
//       "부침가루에 그냥 물 넣지 마세요! 집에 있는 이걸 넣으면 2배 바삭바삭 전이 맛있어져요~! /파전, 파전 만들기, 파전 바삭하게 하는법, 부추전, 해물파전",
//     url: "https://www.youtube.com/watch?v=Z2q-1zffE_8",
//     channel_title: "첫째아들",
//     duration: "7:30",
//     view_count: 1258308,
//     like_count: 24956,
//   },

//   {
//     recipeId: 2,
//     title: "원팬 소고기 야채 볶음밥 | 소고기를 이용한 초간단 요리 !!!",
//     url: "https://www.youtube.com/watch?v=OeJ8SVDTcp4",
//     channel_title: "뇨리 티브이",
//     duration: "0:59",
//     view_count: 79387,
//     like_count: 887,
//   },
// ];

const MyRecipeHistory = () => {
  const [recipeList, setRecipeList] = useState<Video[]>([]);

  //build 통과용 console.log
  //추후 API 연결 시 set함수 사용 예정
  console.log(setRecipeList);

  return (
    <>
      {recipeList && recipeList.length > 0 ? (
        recipeList.map((recipe) => (
          <div key={recipe.recipeId} className="flex flex-col gap-4 items-center py-2">
            <MyRecipeItem recipe={recipe} />
          </div>
        ))
      ) : (
        <NoMyRecipeList text="이전 검색 기록" />
      )}
    </>
  );
};

export default MyRecipeHistory;
