import { useParams } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import RecipeList from "@pages/recipeList/components/RecipeList";
import SelectedIngredients from "@pages/recipeList/components/RecipeListSelectedIngredients";
import Header from "@components/Layout/Header";
import Error from "@components/common/error/ErrorPage";
import LoadingPlayer from "@components/common/loading/LoadingPlayer";
import useIngredientsStore from "@stores/ingredientsStore";
import { usePostRecipeList } from "@hooks/useRecipeHooks";

const RecipeListPage = () => {
  const { recommendType } = useParams();
  const HeaderTitle = recommendType === "AI" ? "AI 레시피" : "레시피";

  const { selectedIngredients } = useIngredientsStore();
  const selectedIngredientsNames = Object.values(selectedIngredients).map((ingredient) => ingredient.name);

  //선택된 재료 기반 레시피 조회 Hook 호출
  const { isLoading } = usePostRecipeList(selectedIngredientsNames);

  if (isLoading) return <LoadingPlayer />;

  return (
    <section className="flex flex-col h-screen p-3">
      <Header title={HeaderTitle} isIcon />
      <div className="flex-1 overflow-auto relative">
        <ErrorBoundary FallbackComponent={Error} onReset={() => window.location.reload()}>
          <RecipeList />
        </ErrorBoundary>
      </div>
      <SelectedIngredients />
    </section>
  );
};

export default RecipeListPage;
