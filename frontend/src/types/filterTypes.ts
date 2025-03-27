export interface filteringInformationKeys {
  categories: string[];
  dietaries: string[];
}

export interface filteredInfomations {
  categories: string[];
  dietaries: string[];
  preferredIngredients: string[];
  dislikedIngredients: string[];
}

export interface FilterElementProps {
  type: "categories" | "dietaries";
  content: string;
  keys: string[];
  elements: string[];
  onSetFilter: (type: "categories" | "dietaries", value: string) => void;
  onClear: (type: "categories" | "dietaries") => void;
}

export interface IngredientsPreferenceProps {
  type: "preferredIngredients" | "dislikedIngredients";
  label: string;
  placeHolder: string;
  selectedList: filteredInfomations;
  onSetFilter: (type: "preferredIngredients" | "dislikedIngredients", value: string) => void;
  onClear: (type: "preferredIngredients" | "dislikedIngredients") => void;
}
