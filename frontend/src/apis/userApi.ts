import instance from "./instance";

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
