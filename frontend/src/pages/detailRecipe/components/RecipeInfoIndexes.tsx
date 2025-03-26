import { RecipeInfoKeys } from "@/types/recipeListTypes";
import RecipeInfoIndex from "./RecipeInfoIndex";

interface RecipeInfoIndexesProps {
  selectedIndex: RecipeInfoKeys;
  setSelectedIndex: (index: RecipeInfoKeys) => void;
}

const RecipeInfoIndexes = ({ selectedIndex, setSelectedIndex }: RecipeInfoIndexesProps) => {
  return (
    <div className="flex w-full">
      <RecipeInfoIndex
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
        text="재료 정보"
        type="ingredients"
      />
      <RecipeInfoIndex
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
        text="요리 꿀팁"
        type="cooking_tips"
      />
    </div>
  );
};

export default RecipeInfoIndexes;
