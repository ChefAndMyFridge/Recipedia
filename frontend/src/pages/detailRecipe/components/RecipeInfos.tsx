import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import VideoInfos from "@components/common/videoInfo/VideoInfos";

import RecipeInfoIndexes from "@pages/detailRecipe/components/RecipeInfoIndexes";
import RecipeTexts from "@pages/detailRecipe/components/RecipeTexts";

import { recipeIngredientsInfo, RecipeInfoKeys } from "@/types/recipeListTypes";

import recipeStore from "@stores/recipeStore";

import { getRecipeTextApi } from "@apis/recipeApi";

const RecipeInfos = () => {
  const { recipeId } = useParams();
  const [selectedIndex, setSelectedIndex] = useState<RecipeInfoKeys>("video_infos");

  // recipeStore 구독
  const { detailRecipe, hasFetchedDetailRecipe, setDetailRecipe } = recipeStore();
  // 로컬 상태로 텍스트 레시피 데이터를 관리하여 변경 감지
  const [textRecipeData, setTextRecipeData] = useState(detailRecipe.textRecipe);

  async function getRecipeText() {
    try {
      const response = await getRecipeTextApi(Number(recipeId));

      setDetailRecipe(response);

      return response;
    } catch (error: unknown) {
      throw new Error(error as string);
    }
  }

  useEffect(() => {
    // console.log("hasFetchedDetailRecipe", hasFetchedDetailRecipe);
    if (!hasFetchedDetailRecipe) return; // 응답 오기 전이면 무시
    if (detailRecipe.hasCaption === false) return; //자막이 없으면 무시

    // console.log("detailRecipe", detailRecipe);
    const detailRecipeCheck =
      detailRecipe.recipeId !== 0 &&
      detailRecipe.textRecipe &&
      detailRecipe.textRecipe?.title &&
      detailRecipe.textRecipe?.cooking_sequence &&
      detailRecipe.textRecipe?.ingredients &&
      detailRecipe.textRecipe?.cooking_tips;

    console.log("recipeText 체크", !detailRecipeCheck, detailRecipeCheck === null);

    if (detailRecipe.hasCaption === true && (!detailRecipeCheck || detailRecipeCheck === null)) {
      console.log("getRecipeText 호출");
      getRecipeText();
    }
  }, [hasFetchedDetailRecipe, detailRecipe]);

  // store의 textRecipe가 변경될 때 로컬 상태 업데이트
  useEffect(() => {
    setTextRecipeData(detailRecipe.textRecipe);
  }, [detailRecipe.textRecipe]);

  return (
    <section className="w-full landscape:h-[85%] portrait:h-[30%] flex flex-col items-center justify-start">
      <RecipeInfoIndexes
        selectedIndex={selectedIndex}
        setSelectedIndex={(index: RecipeInfoKeys) => setSelectedIndex(index)}
      />
      {/* 선택된 인덱스별 자세한 정보 표시
      추후 데이터 변경 필요 */}
      <div className="w-full portrait:min-h-40 portrait:max-h-60 landscape:max-h-[80%] overflow-y-auto p-4 bg-white rounded-b-2xl shadow-md">
        <div className="flex flex-wrap gap-2 h-fit">
          {selectedIndex === "video_infos" && (
            <VideoInfos
              duration={detailRecipe.duration}
              likeCount={detailRecipe.likeCount}
              viewCount={detailRecipe.viewCount}
            />
          )}
          {selectedIndex === "cooking_sequence" &&
            (detailRecipe.hasCaption ? (
              textRecipeData && textRecipeData.cooking_sequence ? (
                <RecipeTexts recipe={textRecipeData.cooking_sequence} />
              ) : (
                <p className="text-base font-preSemiBold">레시피를 추출 중입니다...</p>
              )
            ) : (
              <p className="text-base font-preSemiBold">레시피 정보가 없는 영상입니다.</p>
            ))}

          {selectedIndex === "ingredients" &&
            (detailRecipe.hasCaption ? (
              textRecipeData && textRecipeData.ingredients ? (
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
              )
            ) : (
              <p className="text-base font-preSemiBold">레시피 정보가 없는 영상입니다.</p>
            ))}

          {selectedIndex === "cooking_tips" &&
            (detailRecipe.hasCaption ? (
              textRecipeData && textRecipeData.cooking_tips ? (
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
              )
            ) : (
              <p className="text-base font-preSemiBold">레시피 정보가 없는 영상입니다.</p>
            ))}
        </div>
      </div>
    </section>
  );
};

export default RecipeInfos;
