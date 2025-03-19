import { useParams } from "react-router-dom";
import Header from "@components/Layout/Header";
import MyRecipeHistory from "@pages/myRecipe/components/MyRecipeHistory";
import MyRecipeFavorite from "@pages/myRecipe/components/MyRecipeFavorite";

const MyRecipePage = () => {
  const { myRecipeType } = useParams();
  const TITLE = myRecipeType === "favorite" ? "즐겨찾는 레시피" : "이전 레시피";

  return (
    <section className="flex flex-col h-screen p-3">
      <Header title={TITLE} isIcon />
      {myRecipeType === "favorite" ? <MyRecipeFavorite /> : <MyRecipeHistory />}
    </section>
  );
};

export default MyRecipePage;
