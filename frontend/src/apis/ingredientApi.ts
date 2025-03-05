import instance from "./instance";

const getIngredients = async () => {
  const response = await instance.get("/v1/ingredient");
  console.log("재료 조회", response.data);
  return response.data;
};

export { getIngredients };
