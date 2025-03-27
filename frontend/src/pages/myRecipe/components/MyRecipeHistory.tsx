import { useEffect, useState } from "react";

import { Video } from "@/types/recipeListTypes";

import MyRecipeItem from "@pages/myRecipe/components/MyRecipeItem";
import NoMyRecipeList from "@pages/myRecipe/components/NoMyRecipeList";

import useUserStore from "@stores/userStore";

import { getRecipeRatingApi } from "@apis/recipeApi";

const MyRecipeHistory = () => {
  const { userId } = useUserStore();
  const [recipeList, setRecipeList] = useState<Video[]>([]);

  async function getRecipeRating() {
    const response = await getRecipeRatingApi(userId);
    setRecipeList(response);
  }

  useEffect(() => {
    getRecipeRating();
  }, []);

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
