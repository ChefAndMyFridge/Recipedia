import { RecipeInfoKeys } from "@/types/recipeListTypes";

interface RecipeInfoIndexProps {
  selectedIndex: RecipeInfoKeys;
  setSelectedIndex: (index: RecipeInfoKeys) => void;
  text: string;
  type: RecipeInfoKeys;
}

const RecipeInfoIndex = ({ selectedIndex, setSelectedIndex, text, type }: RecipeInfoIndexProps) => {
  return (
    <div
      className={`px-2 py-3 rounded-t-2xl text-white cursor-pointer text-sm break-keep ${selectedIndex === type ? "bg-primary font-preBold" : "bg-subContent font-preMedium"}`}
      onClick={() => setSelectedIndex(type)}
    >
      {text}
    </div>
  );
};

export default RecipeInfoIndex;
