import instance from "./instance";

import { User } from "@/types/userTypes";
import { filteredInfomations } from "@/types/filterTypes.ts";

export const getMemberListApi = async (): Promise<User[]> => {
  try {
    const response = await instance.get("/v1/member");
    console.log("v1/member", response.data);
    return response.data;
  } catch (error: unknown) {
    throw new Error(error as string);
  }
};

export const addMemberApi = async (newMemberName: string): Promise<User> => {
  try {
    const response = await instance.post("v1/member", {
      membername: newMemberName,
    });
    console.log("v1/member (post)", response.data);
    return response.data;
  } catch (error: unknown) {
    throw new Error(error as string);
  }
};

export const modifyNameApi = async (id: number, newMemberName: string): Promise<User> => {
  try {
    const response = await instance.put(`/v1/member/${id}`, {
      newMembername: newMemberName,
    });
    console.log(`v1/member/${id} (put)`, response.data);
    return response.data;
  } catch (error: unknown) {
    throw new Error(error as string);
  }
};

export const deleteMemberApi = async (id: number) => {
  try {
    const response = await instance.delete(`/v1/member/${id}`);
    console.log(`v1/member/${id} (delete)`, response.data);
    return response.data;
  } catch (error: unknown) {
    throw new Error(error as string);
  }
};

export const getMemberFilterApi = async (
  id: number
): Promise<{ memberId: number; filterData: filteredInfomations }> => {
  try {
    const response = await instance.get(`/v1/filter/${id}`);
    console.log(`v1/filter/${id} (get)`, response.data);
    return response.data;
  } catch (error: unknown) {
    throw new Error(error as string);
  }
};

export const saveMemberFilterApi = async ({
  id,
  filterData,
}: {
  id: number;
  filterData: filteredInfomations;
}): Promise<{ memberId: number; filterData: filteredInfomations }> => {
  try {
    const response = await instance.put(`/v1/filter/${id}`, filterData);
    console.log(`v1/filter/${id} (put)`, response.data);
    return response.data;
  } catch (error: unknown) {
    throw new Error(error as string);
  }
};
