import { useState } from "react";

interface HomeIngredientProps {
  ingredient: IngredientCategory;
}

interface IngredientCategory {
  ingredientInfoId: number;
  name: string;
  imageUrl: string;
  totalCount: number;
  ingredients: IngredientItem[];
}

interface IngredientItem {
  ingredientId: number;
  storagePlace: string;
  expirationDate: string;
  incomingDate: string;
  releasingDate: string | null;
}

const ItemButton = ({ content }: { content: string }) => {
  return (
    <button className="flex justify-center items-center w-[20px] h-[20px] bg-subContent rounded-full">
      <span>{content}</span>
    </button>
  );
};

const HomeIngredient = ({ ingredient }: HomeIngredientProps) => {
  const [count, setCount] = useState<number>(0);

  return (
    <div className="flex flex-col w-[96px] h-[160px] p-1 justify-center items-center g-2">
      <div className="relative bg-content2 w-full aspect-[1/1] rounded-3xl">
        {/* <img src={ingredient.imageUrl} /> */}
        <p className="absolute bottom-0.5 w-full font-preMedium text-xs text-center">{ingredient.name}</p>
      </div>
      <div className="flex w-full justify-between items-center p-1">
        <ItemButton content="-" />
        <span>{count}</span>
        <ItemButton content="+" />
      </div>
    </div>
  );
};

export default HomeIngredient;
