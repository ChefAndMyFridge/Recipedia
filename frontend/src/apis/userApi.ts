import instance from "./instance";

import { User } from "@/types/userTypes";

export const getMemberListApi = async (): Promise<User[]> => {
  try {
    const response = await instance.get("/v1/member");
    console.log("v1/member", response.data);
    return response.data;
  } catch (error: unknown) {
    throw new Error(error as string);
  }
};

export const addMemberApi = async (membername: string): Promise<User> => {
  try {
    const response = await instance.post("v1/member", {
      membername,
    });
    console.log("v1/member (post)", response.data);
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
    console.log(`v1/member/${id}`, response.data);
    return response.data;
  } catch (error: unknown) {
    throw new Error(error as string);
  }
};
