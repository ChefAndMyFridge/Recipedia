export interface Ingredient {
  ingredientId: number;
  storagePlace: string;
  expirationDate: string;
  incomingDate: string;
  releasingDate: string | null;
}

export interface Ingredients {
  ingredientInfoId: number;
  name: string;
  imageUrl: string;
  totalCount: number;
  ingredients: Ingredient[];
}

export interface StoreIngredient {
  name: string;
  imageUrl: string;
  amount: number;
  storagePlace: string;
  expirationDate: string;
  incomingDate: string;
}

export interface StoreResponseIngredient {
  name: string;
  amount: number;
  storagePlace: string;
  expirationDate: string;
  incomingDate: string;
}

export interface SelectedIngredients {
  ingredientInfoId: number;
  name: string;
  imageUrl: string;
  selectedCount: number;
}

export interface filteredInfomations {
  type: string[];
  preference: string[];
  dislike: string[];
}
