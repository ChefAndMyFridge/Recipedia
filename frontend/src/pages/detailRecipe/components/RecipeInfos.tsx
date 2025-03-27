import { useState, useEffect } from "react";

import RecipeInfoIndexes from "@pages/detailRecipe/components/RecipeInfoIndexes";
import RecipeTexts from "@pages/detailRecipe/components/RecipeTexts";

import { recipeIngredientsInfo, RecipeInfoKeys } from "@/types/recipeListTypes";

import recipeStore from "@stores/recipeStore";

import VideoInfoRows from "@components/common/videoInfo/VideoInfoRows";

import { getRecipeTextApi } from "@apis/recipeApi";

const RecipeInfos = () => {
  const [selectedIndex, setSelectedIndex] = useState<RecipeInfoKeys>("video_infos");
  // 로컬 상태로 텍스트 레시피 데이터를 관리하여 변경 감지
  const [textRecipeData, setTextRecipeData] = useState(recipeStore().detailRecipe.textRecipe);

  // recipeStore 구독
  const { detailRecipe, setDetailRecipe } = recipeStore();

  async function getRecipeText() {
    try {
      const response = await getRecipeTextApi(detailRecipe.recipeId);

      setDetailRecipe({
        ...detailRecipe,
        textRecipe: {
          ...response.textRecipe,
        },
      });

      return response;
    } catch (error: unknown) {
      throw new Error(error as string);
    }
  }

  useEffect(() => {
    //텍스트 레시피 추가 추출
    if (!detailRecipe.textRecipe) {
      getRecipeText();
    }
  }, []);

  // store의 textRecipe가 변경될 때 로컬 상태 업데이트
  useEffect(() => {
    setTextRecipeData(detailRecipe.textRecipe);
  }, [detailRecipe.textRecipe]);

  return (
    <section className="w-full flex flex-col items-center justify-center">
      <RecipeInfoIndexes
        selectedIndex={selectedIndex}
        setSelectedIndex={(index: RecipeInfoKeys) => setSelectedIndex(index)}
      />
      {/* 선택된 인덱스별 자세한 정보 표시
      추후 데이터 변경 필요 */}
      <div className="w-full portrait:min-h-40 portrait:max-h-60 landscape:h-[50vh] overflow-y-auto p-4 bg-white rounded-b-2xl shadow-md">
        <div className="flex flex-wrap gap-2 h-fit">
          {selectedIndex === "video_infos" && (
            <VideoInfoRows
              duration={detailRecipe.duration}
              likeCount={detailRecipe.likeCount}
              viewCount={detailRecipe.viewCount}
            />
          )}
          {selectedIndex === "cooking_sequence" &&
            (textRecipeData && textRecipeData.cooking_sequence ? (
              <RecipeTexts recipe={textRecipeData.cooking_sequence} />
            ) : (
              <p className="text-base font-preSemiBold">레시피를 추출 중입니다...</p>
            ))}

          {selectedIndex === "ingredients" &&
            (textRecipeData && textRecipeData.ingredients ? (
              textRecipeData.ingredients.map((item: recipeIngredientsInfo) => (
                <div
                  key={item.name}
                  className="px-4 py-2 text-sm landscape:text-xs font-preSemiBold break-keep rounded-3xl shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]"
                >
                  {item.name} {item.quantity}
                </div>
              ))
            ) : (
              <p className="text-base font-preSemiBold">재료를 파악 중입니다...</p>
            ))}

          {selectedIndex === "cooking_tips" &&
            (textRecipeData && textRecipeData.cooking_tips ? (
              textRecipeData.cooking_tips.map((tip: string, index: number) => (
                <div
                  key={index}
                  className="px-4 py-2 text-sm font-preSemiBold break-keep rounded-3xl shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]"
                >
                  {tip}
                </div>
              ))
            ) : (
              <p className="text-base font-preSemiBold">요리 꿀팁을 생성 중입니다...</p>
            ))}
        </div>
      </div>
    </section>
  );
};

export default RecipeInfos;
