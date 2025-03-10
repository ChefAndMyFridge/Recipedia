import RecipeList from "@pages/recipeList/components/RecipeList";
import Header from "@components/Layout/Header";
import SelectedIngredients from "@pages/recipeList/components/SelectedIngredients";

const RecipeListPage = () => {
  //레시피 목록 api 호출 예정
  return (
    <section className="flex flex-col min-h-screen justify-between p-3">
      <Header title="레시피" isIcon className="h-[20%]" />
      <RecipeList />
      <SelectedIngredients />
    </section>
  );
};

export default RecipeListPage;
