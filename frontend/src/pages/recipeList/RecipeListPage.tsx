import { useParams } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import RecipeList from "@pages/recipeList/components/RecipeList";
import SelectedIngredients from "@pages/recipeList/components/RecipeListSelectedIngredients";
import Header from "@components/Layout/Header";
import ErrorPage from "@components/common/error/ErrorPage";
import LoadingPlayer from "@components/common/loading/LoadingPlayer";
import { usePostRecipeList } from "@hooks/useRecipeHooks";
import useRecipeStore from "@stores/recipeStore";

const RecipeListPage = () => {
  const { recommendType } = useParams();
  const HeaderTitle = recommendType === "AI" ? "AI 레시피" : "레시피";

  const { recipeSelectedIngredients } = useRecipeStore();
  const selectedIngredientsNames = recipeSelectedIngredients.map((ingredient) => ingredient.name);

  //선택된 재료 기반 레시피 조회 Hook 호출
  const { isLoading, isError } = usePostRecipeList(selectedIngredientsNames);

  if (isLoading) return <LoadingPlayer />;
  if (isError) return <ErrorPage />;

  return (
    <section className="flex flex-col h-screen p-3">
      <Header title={HeaderTitle} isIcon />
      <div className="flex-1 overflow-auto relative">
        <ErrorBoundary FallbackComponent={ErrorPage}>
          <RecipeList />
        </ErrorBoundary>
      </div>
      <SelectedIngredients />
    </section>
  );
};

export default RecipeListPage;
