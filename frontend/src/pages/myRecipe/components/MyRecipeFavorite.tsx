import { useEffect, useState } from "react";
import { Video } from "@/types/recipeListTypes";

import MyRecipeItem from "@pages/myRecipe/components/MyRecipeItem";
import NoMyRecipeList from "@pages/myRecipe/components/NoMyRecipeList";

import { getRecipeFavoriteApi } from "@apis/recipeApi";

import useUserStore from "@stores/userStore";

const MyRecipeFavorite = () => {
  const { userId } = useUserStore();
  const [recipeList, setRecipeList] = useState<Video[]>([]);

  async function getRecipeFavorite() {
    const response = await getRecipeFavoriteApi(userId);
    setRecipeList(response);
  }

  useEffect(() => {
    getRecipeFavorite();
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
        <NoMyRecipeList text="즐겨찾는" />
      )}
    </>
  );
};

export default MyRecipeFavorite;
