import { Route, Routes } from "react-router-dom";
import HomePage from "@pages/home/HomePage";
import RecipeListPage from "@pages/recipeList/RecipeListPage";
import DetailRecipePage from "@pages/detailRecipe/DetailRecipePage";
import SettingPage from "@pages/setting/SettingPage";
import MyRecipePage from "@pages/myRecipe/MyRecipePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/recipeList/:recommendType" element={<RecipeListPage />} />
      <Route path="/detailRecipe/:recipeId" element={<DetailRecipePage />} />
      <Route path="/setting" element={<SettingPage />} />
      <Route path="/setting/:myRecipeType" element={<MyRecipePage />} />
    </Routes>
  );
}

export default App;
