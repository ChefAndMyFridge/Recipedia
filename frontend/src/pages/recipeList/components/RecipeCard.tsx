import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Video } from "@/types/recipeListTypes";

import { getYoutubeThumbnailUrl } from "@utils/getYoutubeThumbnailUrl";

import VideoInfos from "@components/common/videoInfo/VideoInfos";
import Button from "@components/common/button/Button";

import IconHeart from "@assets/icons/IconHeart";
import IconHeartFill from "@assets/icons/IconHeartFill";

import useUserStore from "@stores/userStore";

import { patchRecipeApi } from "@apis/recipeApi";

interface RecipeCardProps {
  video: Video;
}

const RecipeCard = ({ video }: RecipeCardProps) => {
  const navigate = useNavigate();
  const { userId } = useUserStore();
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const thumbnailUrl = getYoutubeThumbnailUrl(video.url);

  const handleLike = () => {
    const newLiked = !isLiked;
    setIsLiked(newLiked);

    //추후 API 연결 시, 좋아요 서버 데이터 반영
    patchRecipeApi(userId, video.recipeId, 0, newLiked);
  };

  return (
    <div className={`flex justify-center`}>
      <div className="w-[80%] h-[60vh] min-h-[450px] p-3 flex flex-col justify-between bg-white rounded-2xl">
        <img
          src={thumbnailUrl}
          alt={video.title}
          className="w-full h-[45%] min-h-[200px] rounded-xl object-contain bg-black"
        />
        <div className="flex justify-between items-center">
          <p className="max-w-[90%] overflow-hidden text-ellipsis whitespace-nowrap font-preSemiBold text-base break-keep">
            {video.title}
          </p>
          <button className="text-sm" onClick={handleLike}>
            {isLiked ? (
              <IconHeartFill width={30} height={31} strokeColor="black" />
            ) : (
              <IconHeart width={30} height={30} strokeColor="black" />
            )}
          </button>
        </div>
        <VideoInfos video={video} />
        <div className="w-full flex justify-end items-center">
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
