import { RecipeInfoKeys } from "@/types/recipeListTypes";
import RecipeInfoIndex from "@pages/detailRecipe/components/RecipeInfoIndex";

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
        text="영상 정보"
        type="video_infos"
      />
      <RecipeInfoIndex
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
        text="레시피"
        type="cooking_sequence"
      />
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
