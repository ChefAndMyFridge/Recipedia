import { Route, Routes } from "react-router-dom";
import HomePage from "@pages/home/HomePage";
import RecipeListPage from "@pages/recipeList/RecipeListPage";
import DetailRecipePage from "@pages/detailRecipe/DetailRecipePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/recipeList/:recommendType" element={<RecipeListPage />} />
      <Route path="/detailRecipe/:recipeId" element={<DetailRecipePage />} />
    </Routes>
  );
}

export default App;
