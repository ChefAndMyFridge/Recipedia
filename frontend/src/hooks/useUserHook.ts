import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { getMemberListApi, addMemberApi, deleteMemberApi } from "@apis/userApi";

import { User } from "@/types/userTypes";

export const useGetMemberList = () => {
  const query = useQuery({
    queryKey: ["memberList"],
    queryFn: getMemberListApi,
    staleTime: 1000 * 60 * 60 * 24,
  });

  return query;
};

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
