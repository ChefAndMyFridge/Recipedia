import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { Ingredients } from "@/types/ingredientsTypes";

import { getIngredients } from "@apis/ingredientApi";

import useIngredientsStore from "@stores/ingredientsStore";

export const useGetIngredientsList = () => {
  const { setIngredients } = useIngredientsStore();

  const query = useQuery<Ingredients[]>({
    queryKey: ["ingredients"],
    queryFn: getIngredients,
    staleTime: 1000 * 60 * 60 * 24, // 1일
    throwOnError: true,
  });

  useEffect(() => {
    if (query.data) {
      setIngredients(query.data);
    }
  }, [query.data, setIngredients]);
};
