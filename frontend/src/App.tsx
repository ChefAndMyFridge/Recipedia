import { Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import HomePage from "@pages/home/HomePage";
import LoginPage from "@pages/auth/LoginPage";
import RecipeListPage from "@pages/recipeList/RecipeListPage";
import DetailRecipePage from "@pages/detailRecipe/DetailRecipePage";
import SettingPage from "@pages/setting/SettingPage";
import MyRecipePage from "@pages/myRecipe/MyRecipePage";
import PreferencePage from "@pages/preference/PreferencePage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/recipeList/:recommendType" element={<RecipeListPage />} />
        <Route path="/detailRecipe/:recipeId" element={<DetailRecipePage />} />
        <Route path="/setting" element={<SettingPage />} />
        <Route path="/setting/:myRecipeType" element={<MyRecipePage />} />
        <Route path="/setting/preference" element={<PreferencePage />} />
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
