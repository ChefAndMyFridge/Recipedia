import { useEffect, useState } from "react";

import { PagenationRecipeInfo } from "@/types/recipeListTypes";

import MyRecipeItem from "@pages/myRecipe/components/MyRecipeItem";
import NoMyRecipeList from "@pages/myRecipe/components/NoMyRecipeList";
import Pagination from "@pages/myRecipe/components/MyRecipePagenation";

import useUserStore from "@stores/userStore";
import { getRecipeFavoriteApi } from "@apis/recipeApi";

const MyRecipeFavorite = () => {
  const { userId } = useUserStore();

  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [numberOfElements, setNumberOfElements] = useState(0);
  const [recipeList, setRecipeList] = useState<PagenationRecipeInfo[]>([]);

  async function getRecipeFavorite(pageNumber: number) {
    try {
      const response = await getRecipeFavoriteApi(userId, pageNumber - 1);

      setRecipeList(response.content);
      setTotalPage(response.totalPages);
      setNumberOfElements(response.numberOfElements);
      setPage(response.pageable.pageNumber + 1);
    } catch (error) {
      console.error("Error fetching recipe rating:", error);
    }
  }

  useEffect(() => {
    getRecipeFavorite(1);
  }, []);

  return (
    <div className="flex flex-col items-center justify-around w-full h-full">
      <div className="flex flex-col items-center justify-start w-full h-[80%]">
        {recipeList && recipeList.length > 0 ? (
          recipeList.map((recipe) => (
            <div key={recipe.recipeId} className="flex flex-col items-center w-full gap-4 py-2">
              <MyRecipeItem
                currentPage={page}
                numberOfElements={numberOfElements}
                type="favorite"
                recipe={recipe}
                onDelete={getRecipeFavorite}
              />
            </div>
          ))
        ) : (
          <NoMyRecipeList text="이전 검색 기록" />
        )}
      </div>

      {/* 페이지네이션 적용 */}
      {recipeList && recipeList.length > 0 && (
        <Pagination totalPages={totalPage} currentPage={page} onPageChange={getRecipeFavorite} />
      )}
    </div>
  );
};

export default MyRecipeFavorite;
