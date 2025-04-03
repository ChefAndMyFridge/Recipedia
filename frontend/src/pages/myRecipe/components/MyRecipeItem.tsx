import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import useUserStore from "@stores/userStore";
import useRecipeStore from "@stores/recipeStore";

import { Video } from "@/types/recipeListTypes";

import Button from "@components/common/button/Button";
import VideoInfoRows from "@components/common/videoInfo/VideoInfoRows";

import { patchRecipeApi } from "@apis/recipeApi";

const MyRecipeItem = ({ recipe }: { recipe: Video }) => {
  const navigate = useNavigate();

  const { userId } = useUserStore();
  const { updateRecipeFavorite } = useRecipeStore();

  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);

  function handleTouchStart(event: React.TouchEvent) {
    setStartX(event.touches[0].clientX);
  }

  function handleTouchMove(event: React.TouchEvent) {
    const moveX = event.touches[0].clientX;
    const diff = moveX - startX;

    if (diff < 0) {
      setTranslateX(Math.max(diff, -80));
    } else if (diff > 0) {
      setTranslateX(Math.min(diff, 0)); // 오른쪽으로 이동할 때는 원래 위치로 복귀
    }
  }

  function handleTouchEnd() {
    // 50px 이상 스와이프하면 고정, 아니면 원래 위치로 복귀
    if (translateX < -50) {
      setTranslateX(-80);
    } else {
      setTranslateX(0);
    }
  }

  async function handleDelete(recipe: Video) {
    try {
      const response = await patchRecipeApi(userId, recipe.recipeId, 0, false);
      updateRecipeFavorite(recipe.recipeId, response.favorite);
    } catch (error) {
      console.error("Failed to update favorite status:", error);
    }
  }

  return (
    <div
      key={recipe.recipeId}
      className="relative w-[90%] h-24 bg-white rounded-xl shadow-md overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 삭제 버튼  */}
      <button
        onClick={() => handleDelete(recipe)}
        className="absolute right-0 top-0 h-full px-4 bg-error font-preSemiBold text-white transition-all duration-200"
        style={{
          transform: `translateX(${Math.min(translateX + 80, 80)}px)`, // 점진적으로 나타남
          opacity: Math.min(Math.abs(translateX) / 80, 1), // 80px 이동할 때 100% 투명도
        }}
      >
        삭제
      </button>

      {/* 레시피 아이템 */}
      <div
        className="flex flex-col items-start p-4 gap-4 transition-transform duration-200"
        style={{ transform: `translateX(${translateX}px)` }}
      >
        <div className="flex justify-between items-center w-full">
          <p className="w-[60%] font-preBold text-md overflow-hidden text-ellipsis whitespace-nowrap">{recipe.title}</p>
          <Button
            type="button"
            design="confirm"
            content="요리하기"
            onAction={() => navigate(`/detailRecipe/${recipe.recipeId}`)}
            className="px-3 py-1"
          />
        </div>
        <VideoInfoRows duration={recipe.duration} likeCount={recipe.likeCount} viewCount={recipe.viewCount} />
      </div>
    </div>
  );
};

export default MyRecipeItem;
