import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  Ingredients,
  StoreIngredient,
  StoreResponseIngredient,
  IngredientNutrition,
  DeleteIngredient,
  DeleteIngredientResponse,
} from "@/types/ingredientsTypes";

import {
  getIngredientsApi,
  storeIngredientApi,
  getIngredientNutritionApi,
  deleteIngredientApi,
} from "@apis/ingredientApi";

import useIngredientsStore from "@stores/ingredientsStore";

// 고내에 저장된 재료 목록 조회
export const useGetIngredientsList = () => {
  const { setIngredients } = useIngredientsStore();

  const query = useQuery<Ingredients[]>({
    queryKey: ["ingredients"],
    queryFn: getIngredientsApi,
    staleTime: 1000 * 60 * 60 * 24, // 1일 (추후 줄일 예정: 8시간 이하 정도?)
    throwOnError: true,
  });

  useEffect(() => {
    if (Array.isArray(query.data)) {
      setIngredients(query.data);
    }
  }, [query.data, setIngredients]);

  return query;
};

// 재료 입고
export const useStoreIngredient = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<StoreResponseIngredient, Error, StoreIngredient>({
    mutationFn: storeIngredientApi, // 재료 저장 API 호출
    onSuccess: () => {
      console.log("재료 저장 성공!");

      // 저장 성공 시, 기존 재료 목록을 무효화하여 자동으로 다시 가져옴
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
    },
    onError: (error) => {
      console.error("재료 저장 실패:", error);
    },
  });

  return mutation;
};

// 영양 정보 조회
export const useGetIngredientNutrition = (ingredientId: number) => {
  const query = useQuery<IngredientNutrition>({
    queryKey: ["ingredientNutrition", ingredientId],
    queryFn: () => getIngredientNutritionApi(ingredientId),
    throwOnError: true,
  });

  return query;
};

// 재료 삭제
export const useDeleteIngredient = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<DeleteIngredientResponse, Error, DeleteIngredient[]>({
    mutationFn: deleteIngredientApi, // 재료 삭제 API 호출
    onSuccess: () => {
      console.log("재료 삭제 성공!");

      // 삭제 성공 시, 기존 재료 목록을 무효화하여 자동으로 다시 가져옴
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
    },
    onError: (error) => {
      console.error("재료 삭제 실패:", error);
    },
  });

  return mutation;
};
