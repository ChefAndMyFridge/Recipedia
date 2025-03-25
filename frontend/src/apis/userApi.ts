import instance from "./instance";

import { User } from "@/types/userTypes";

export const getMemberListApi = async (): Promise<User[]> => {
  try {
    const response = await instance.get("/v1/member");
    return response.data;
  } catch (error: unknown) {
    throw new Error(error as string);
  }
};

export const modifyNameApi = async (id: number, newMemberName: string) => {
  try {
    const response = await instance.put(`/v1/member/${id}`, {
      newMembername: newMemberName,
    });
    return response.data;
  } catch (error: unknown) {
    throw new Error(error as string);
  }
};
