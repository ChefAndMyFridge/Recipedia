import { Route, Routes } from "react-router-dom";
import HomePage from "@pages/HomePage";
import RecipeListPage from "@pages/RecipeListPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/recipeList" element={<RecipeListPage />} />
    </Routes>
  );
}

export default App;
