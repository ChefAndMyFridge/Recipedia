import RecipeList from "@pages/recipeList/components/RecipeList";
import Header from "@components/Layout/Header";
import SelectedIngredients from "@/pages/recipeList/components/RecipeListSelectedIngredients";
import { useParams } from "react-router-dom";

const RecipeListPage = () => {
  //레시피 목록 api 호출 예정
  const { recommendType } = useParams();
  const HeaderTitle = recommendType === "AI" ? "AI 레시피" : "레시피";

  return (
    <section className="flex flex-col h-screen p-3">
      <Header title={HeaderTitle} isIcon />
      <div className="flex-1 overflow-auto relative">
        <RecipeList />
      </div>
      <SelectedIngredients />
    </section>
  );
};

export default RecipeListPage;
