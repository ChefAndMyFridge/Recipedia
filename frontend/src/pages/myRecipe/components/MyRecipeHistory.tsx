import { useEffect, useState } from "react";

import { PagenationRecipeInfo } from "@/types/recipeListTypes";

import MyRecipeItem from "@pages/myRecipe/components/MyRecipeItem";
import NoMyRecipeList from "@pages/myRecipe/components/NoMyRecipeList";
import Pagination from "@pages/myRecipe/components/MyRecipePagenation";

import useUserStore from "@stores/userStore";
import { getRecipeRatingApi } from "@apis/recipeApi";

const MyRecipeHistory = () => {
  const { userId } = useUserStore();

  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [recipeList, setRecipeList] = useState<PagenationRecipeInfo[]>([]);

  async function getRecipeRating(pageNumber: number) {
    try {
      const response = await getRecipeRatingApi(userId, pageNumber - 1); // API는 0-based index 사용
      setRecipeList(response.content);
      setTotalPage(response.totalPages + 1);
      setPage(response.pageable.pageNumber + 1);
    } catch (error) {
      console.error("Error fetching recipe rating:", error);
    }
  }

  useEffect(() => {
    getRecipeRating(1);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      {recipeList && recipeList.length > 0 ? (
        recipeList.map((recipe) => (
          <div key={recipe.recipeId} className="flex flex-col items-center w-full gap-4 py-2">
            <MyRecipeItem recipe={recipe} />
          </div>
        ))
      ) : (
        <NoMyRecipeList text="이전 검색 기록" />
      )}

      {/* 페이지네이션 적용 */}
      <Pagination totalPages={totalPage} currentPage={page} onPageChange={getRecipeRating} />
    </div>
  );
};

export default MyRecipeHistory;
