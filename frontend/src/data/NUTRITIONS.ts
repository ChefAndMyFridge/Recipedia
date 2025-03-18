export const NUTRITIONS = {
  calories: 0,
  carbohydrate: 0,
  protein: 0,
  fat: 0,
  sodium: 0,
  sugars: 0,
  cholesterol: 0,
  saturatedFat: 0,
  unsaturatedFat: 0,
  transFat: 0,
  allergenInfo: "",
};

export const INGREDIENT_WITH_NUTRITIONS = {
  ingredientInfoId: 130,
  name: "참외",
  imageUrl: "https://image.com",
  totalCount: 2,
  ingredients: [
    {
      ingredientId: 1,
      storagePlace: "냉장고",
      expirationDate: "2025-03-08T11:00:00",
      incomingDate: "2025-03-01T12:00:00",
      releasingDate: "2025-03-05T12:00:00",
    },
    {
      ingredientId: 2,
      storagePlace: "냉장고",
      expirationDate: "2025-03-08T11:00:00",
      incomingDate: "2025-03-01T12:00:00",
      releasingDate: "2025-03-05T12:00:00",
    },
  ],
  nutrients: {
    calories: 45,
    carbohydrate: 11.23,
    protein: 1.33,
    fat: 0.04,
    sodium: 3,
    sugars: 9.81,
    cholesterol: 0,
    saturatedFat: 0.01,
    unsaturatedFat: 0.03,
    transFat: 0,
    allergenInfo: "과일류",
  },
};
