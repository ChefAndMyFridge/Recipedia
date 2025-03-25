import { useQuery } from "@tanstack/react-query";

import { getMemberListApi } from "@apis/userApi";

export const useGetMemberList = () => {
  const query = useQuery({
    queryKey: ["memberList"],
    queryFn: getMemberListApi,
    staleTime: 1000 * 60 * 60 * 24,
  });

  return query;
};
