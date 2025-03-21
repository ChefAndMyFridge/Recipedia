import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getRecipeDetailApi, makeRecipeApi } from "@apis/recipeApi";
import recipeStore from "@stores/recipeStore";
import { RecipeInfo, RecipeList } from "@/types/recipeListTypes";

//선택 재료 기반 레시피 리스트 조회 API 호출
export const usePostRecipeList = (ingredients: string[]) => {
  const { setRecipeList } = recipeStore();

  const query = useQuery<RecipeList>({
    queryKey: ["recipeList", ingredients],
    queryFn: () => makeRecipeApi(ingredients),
    staleTime: 1000 * 60 * 60 * 24, // 1일, 추후 줄일 필요 O
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

//레시피 상세 및 텍스트 추출 API
export const useGetRecipeDetail = (recipeId: number) => {
  const { setDetailRecipe } = recipeStore();

  const query = useQuery<RecipeInfo>({
    queryKey: ["recipeDetail", recipeId],
    queryFn: () => getRecipeDetailApi(recipeId),
    staleTime: 1000 * 60 * 60 * 24,
  });

  // useEffect로 data 변화 관찰
  useEffect(() => {
    if (query.data) {
      setDetailRecipe(query.data);
    }
  }, [query.data, setDetailRecipe]);

  return {
    isLoading: query.isLoading,
    isError: query.isError,
    isFetching: query.isFetching,
    data: query.data,
  };
};
