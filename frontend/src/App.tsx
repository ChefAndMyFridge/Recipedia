import { Route, Routes } from "react-router-dom";
import HomePage from "@/pages/home/HomePage";
import RecipeListPage from "@pages/recipeList/RecipeListPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/recipeList" element={<RecipeListPage />} />
    </Routes>
  );
}

export default App;
