import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { User } from "@/types/userTypes";
import { filteredInfomations } from "@/types/ingredientsTypes";

import {
  getMemberListApi,
  addMemberApi,
  deleteMemberApi,
  getMemberFilterApi,
  saveMemberFilterApi,
} from "@apis/userApi";

import useUserStore from "@stores/userStore";
import useIngredientsStore from "@stores/ingredientsStore";

// 가족 구성원 목록 조회
export const useGetMemberList = () => {
  const query = useQuery({
    queryKey: ["memberList"],
    queryFn: getMemberListApi,
    staleTime: 1000 * 60 * 60 * 24,
  });

  return query;
};

// 가족 구성원 추가
export const useAddMember = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<User, Error, string>({
    mutationFn: addMemberApi,
    onSuccess: () => {
      console.log("가족 구성원 등록 성공");
      queryClient.invalidateQueries({ queryKey: ["memberList"] });
    },
    onError: (error) => {
      console.log("가족 구성원 등록 실패", error);
    },
  });

  return mutation;
};

// 가족 구성원 삭제
export const useDeleteMember = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<void, Error, number>({
    mutationFn: deleteMemberApi,
    onSuccess: () => {
      console.log("가족 구성원 삭제 성공");
      queryClient.invalidateQueries({ queryKey: ["memberList"] });
    },
    onError: (error) => {
      console.log("가족 구성원 삭제 실패", error);
    },
  });

  return mutation;
};

export const useGetFilteredInfomations = () => {
  const { userId } = useUserStore();
  const { setInitFilteredInfomations } = useIngredientsStore();

  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["filteredInfomations", userId],
    queryFn: () => getMemberFilterApi(userId),
    staleTime: 1000 * 60 * 60 * 24,
  });

  // userId 또는 filteredInfomations가 변경될 때마다 refetch 실행
  useEffect(() => {
    queryClient.cancelQueries({ queryKey: ["filteredInfomations", userId] });
    query.refetch();
  }, [queryClient, query.refetch, userId]);

  useEffect(() => {
    if (query.data) {
      setInitFilteredInfomations(query.data.filterData);
    }
  }, [query.data, setInitFilteredInfomations]);

  return query;
};

export const useSaveFilteredInfomations = () => {
  const { userId } = useUserStore();

  const queryClient = useQueryClient();

  const mutation = useMutation<
    { memberId: number; filterData: filteredInfomations },
    Error,
    { id: number; filterData: filteredInfomations }
  >({
    mutationFn: saveMemberFilterApi,
    onSuccess: () => {
      console.log("필터 저장 성공");
      queryClient.invalidateQueries({ queryKey: ["filteredInfomations", userId] }); // 🔥 캐시 무효화하여 refetch 실행
    },
    onError: (error) => {
      console.log("필터 저장 실패", error);
    },
  });

  return mutation;
};
