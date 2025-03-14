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

export interface SelectedIngredients {
  ingredientInfoId: number;
  name: string;
  imageUrl: string;
  selectedCount: number;
}
