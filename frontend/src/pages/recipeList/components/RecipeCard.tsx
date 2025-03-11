import IconHeart from "@assets/icons/IconHeart";
import { Video } from "@/types/recipeListTypes";
import { getYoutubeThumbnailUrl } from "@utils/getYoutubeThumbnailUrl";
import VideoInfos from "@components/common/videoInfo/VideoInfos";
import Button from "@components/common/button/Button";

interface RecipeCardProps {
  video: Video;
}

const RecipeCard = ({ video }: RecipeCardProps) => {
  const thumbnailUrl = getYoutubeThumbnailUrl(video.url);
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
          <button className="text-sm">
            <IconHeart width={30} height={30} strokeColor="black" />
          </button>
        </div>
        <VideoInfos video={video} />
        <div className="w-full flex justify-end items-center">
          <Button type="button" design="confirm" content="요리하기" className="w-24 h-8" />
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
