import { useState } from "react";
import RecipeInfoIndexes from "@pages/detailRecipe/components/RecipeInfoIndexes";
import { RecipeInfoKeys } from "@/types/recipeListTypes";
import recipeStore from "@stores/recipeStore";

const RecipeInfos = () => {
  const [selectedIndex, setSelectedIndex] = useState<RecipeInfoKeys>("ingredients");

  const { detailRecipe } = recipeStore();

  return (
    <section className="w-full flex flex-col items-center justify-center">
      <RecipeInfoIndexes
        selectedIndex={selectedIndex}
        setSelectedIndex={(index: RecipeInfoKeys) => setSelectedIndex(index)}
      />
      {/* 선택된 인덱스별 자세한 정보 표시
      추후 데이터 변경 필요 */}
      <div className="w-full portrait:max-h-[210px] landscape:h-[50vh] overflow-y-auto p-4 bg-white rounded-b-2xl shadow-md">
        <div className="flex flex-wrap gap-2 h-fit">
          {detailRecipe[selectedIndex].map((item: string) => (
            <div
              key={item}
              className="px-4 py-2 text-sm font-preSemiBold break-keep rounded-3xl shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecipeInfos;
