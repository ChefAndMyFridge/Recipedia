import { Route, Routes } from "react-router-dom";
import HomePage from "@pages/home/HomePage";
import RecipeListPage from "@pages/recipeList/RecipeListPage";
import DetailRecipePage from "@pages/detailRecipe/DetailRecipePage";
import SettingPage from "@pages/setting/SettingPage";
import MyRecipePage from "@pages/myRecipe/MyRecipePage";
import PreferencePage from "@pages/preference/PreferencePage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Login from '@pages/login/Login';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/recipeList/:recommendType" element={<RecipeListPage />} />
        <Route path="/detailRecipe/:recipeId" element={<DetailRecipePage />} />
        <Route path="/setting" element={<SettingPage />} />
        <Route path="/setting/:myRecipeType" element={<MyRecipePage />} />
        <Route path="/setting/preference" element={<PreferencePage />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
