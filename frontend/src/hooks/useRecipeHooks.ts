import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { makeRecipeApi } from "@apis/recipeApi";
import recipeStore from "@stores/recipeStore";
import { RecipeList } from "@/types/recipeListTypes";

export const usePostRecipeList = (ingredients: string[]) => {
  const { setRecipeList } = recipeStore();

  const query = useQuery<RecipeList>({
    queryKey: ["recipeList", ingredients],
    queryFn: () => makeRecipeApi(ingredients),
    staleTime: 1000 * 60 * 5, //5분
    throwOnError: true,
  });

  //query 호출 후 데이터 저장
  useEffect(() => {
    if (query.data) {
      setRecipeList(query.data);
    }
  }, [query.data, setRecipeList]);

  return query;
};
