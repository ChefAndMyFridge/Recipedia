import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Video } from "@/types/recipeListTypes";

import { getYoutubeThumbnailUrl } from "@utils/getYoutubeThumbnailUrl";

import VideoInfos from "@components/common/videoInfo/VideoInfos";
import Button from "@components/common/button/Button";

import IconHeart from "@assets/icons/IconHeart";
import IconHeartFill from "@assets/icons/IconHeartFill";
import IconPremium from "@assets/icons/IconPremium";

import useUserStore from "@stores/userStore";
import useRecipeStore from "@stores/recipeStore";

import { patchRecipeApi } from "@apis/recipeApi";
import ReactPlayer from "react-player";

interface RecipeCardProps {
  video: Video;
}

const RecipeCard = ({ video }: RecipeCardProps) => {
  const navigate = useNavigate();
  const { userId } = useUserStore();
  const { updateRecipeFavorite } = useRecipeStore();

  const [isLiked, setIsLiked] = useState<boolean>(video.favorite);

  const thumbnailUrl = getYoutubeThumbnailUrl(video.url);

  async function handleLike() {
    const newLiked = !isLiked;
    setIsLiked(newLiked);

    try {
      const response = await patchRecipeApi(userId, video.recipeId, 0, newLiked);
      // API 응답의 favorite 값으로 store 업데이트
      updateRecipeFavorite(video.recipeId, response.favorite);
    } catch (error) {
      // 실패시 상태 되돌리기
      setIsLiked(!newLiked);
      console.error("Failed to update favorite status:", error);
    }
  }

  return (
    <div className={`flex justify-center`}>
      <div className="w-[80%] h-[60vh] min-h-[450px] p-3 flex flex-col justify-between bg-white rounded-2xl">
        <ReactPlayer
          url={video.url}
          width="100%"
          height="45%"
          playing={true}
          controls={true}
          light={thumbnailUrl}
          style={{ backgroundColor: "black" }}
        />

        <div className="flex w-full justify-between items-center">
          <div className="w-full flex flex-col items-start">
            {video.hasCaption ? (
              <div className="h-5 flex items-center gap-1">
                <IconPremium width={20} height={20} />
                <p className="text-xs font-preSemiBold text-center text-longContent">고품질 레시피</p>
              </div>
            ) : (
              <div className="h-5"></div>
            )}

            <div className="flex w-full justify-between items-center px-1">
              <p className="max-w-[85%] overflow-hidden text-ellipsis whitespace-nowrap font-preSemiBold text-base break-keep">
                {video.title}
              </p>

              <button className="text-sm" onClick={handleLike}>
                {isLiked ? (
                  <IconHeartFill width={25} height={25} strokeColor="black" />
                ) : (
                  <IconHeart width={25} height={25} strokeColor="black" strokeWidth={2} />
                )}
              </button>
            </div>
          </div>
        </div>
        <VideoInfos duration={video.duration} viewCount={video.viewCount} likeCount={video.likeCount} />
        <div className="w-full flex justify-end items-center gap-2">
          <Button
            type="button"
            design="confirm"
            content="요리하기"
            className="w-24 h-8"
            onAction={() => navigate(`/detailRecipe/${video.recipeId}`)}
          />
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
