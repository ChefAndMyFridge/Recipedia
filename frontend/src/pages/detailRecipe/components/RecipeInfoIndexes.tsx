import Toggle from "@/components/common/toggle/Toggle";
import { RecipeInfoKeys } from "@/types/recipeListTypes";
import RecipeInfoIndex from "@pages/detailRecipe/components/RecipeInfoIndex";

interface RecipeInfoIndexesProps {
  selectedIndex: RecipeInfoKeys;
  setSelectedIndex: (index: RecipeInfoKeys) => void;
  isAutoScroll: boolean;
  setIsAutoScroll: (isAutoScroll: boolean) => void;
}

const RecipeInfoIndexes = ({
  selectedIndex,
  setSelectedIndex,
  isAutoScroll,
  setIsAutoScroll,
}: RecipeInfoIndexesProps) => {
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
        text="레시피 단계"
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
      <Toggle isToggle={isAutoScroll} onToggle={setIsAutoScroll} />
    </div>
  );
};

export default RecipeInfoIndexes;
