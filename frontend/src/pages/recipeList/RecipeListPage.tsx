import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";

import RecipeList from "@pages/recipeList/components/RecipeList";
import NoRecipeList from "@pages/recipeList/components/NoRecipeList";
import SelectedIngredients from "@pages/recipeList/components/RecipeListSelectedIngredients";

import Header from "@components/Layout/Header";
import ErrorPage from "@components/common/error/ErrorPage";
import LoadingPlayer from "@components/common/loading/LoadingPlayer";

import { usePostRecipeList } from "@hooks/useRecipeHooks";
import useRecipeStore from "@stores/recipeStore";
import useUserStore from "@/stores/userStore";

const RecipeListPage = () => {
  const { recommendType } = useParams();
  const { userId } = useUserStore();
  const { recipeSelectedIngredients, recipeList } = useRecipeStore();

  const [DISHES, setDISHES] = useState<string[]>([]);

  const HeaderTitle = recommendType === "AI" ? "AI 레시피" : "레시피";

  //선택된 재료 기반 레시피 조회 Hook 호출
  const selectedIngredientsNames = recipeSelectedIngredients.map((ingredient) => ingredient.name);
  const { isLoading, isError } = usePostRecipeList(userId, selectedIngredientsNames);

  //레시피 추출 시 DISHES 상태 업데이트
  useEffect(() => {
    if (recipeList.dishes.length > 0) {
      setDISHES(recipeList.dishes);
    } else {
      setDISHES([]);
    }
  }, [recipeList]);

  if (isLoading) return <LoadingPlayer />;
  if (isError) return <ErrorPage />;

  return (
    <section className="flex flex-col h-screen p-3">
      {DISHES.length > 0 ? (
        <>
          <Header title={HeaderTitle} isIcon />
          <div className="flex-1 overflow-auto relative">
            <ErrorBoundary FallbackComponent={ErrorPage}>
              <RecipeList DISHES={DISHES} />
            </ErrorBoundary>
          </div>
          <SelectedIngredients />
        </>
      ) : (
        <NoRecipeList text="생성된" />
      )}
    </section>
  );
};

export default RecipeListPage;
