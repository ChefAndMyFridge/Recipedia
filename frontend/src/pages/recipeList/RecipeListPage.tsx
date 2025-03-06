import RecipeList from "@pages/recipeList/components/RecipeList";
import Header from "@components/Layout/Header";

const RecipeListPage = () => {
  //레시피 목록 api 호출 예정
  return (
    <section className="flex flex-col h-full">
      <Header title="레시피" isIcon className="h-[20%]" />
      <RecipeList />
    </section>
  );
};

export default RecipeListPage;
