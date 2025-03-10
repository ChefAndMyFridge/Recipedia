import IconClock from "@assets/icons/IconClock";
import IconHeart from "@assets/icons/IconHeart";
import IconLike from "@assets/icons/IconLike";
import IconView from "@assets/icons/IconView";
import { Video } from "@/types/recipeListTypes";
import { getYoutubeThumbnailUrl } from "@utils/getYoutubeThumbnailUrl";
import VideoInfo from "@components/common/VideoInfo";

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
        <div className="flex justify-around items-center">
          <VideoInfo IconName={IconClock} InfoData={video.duration} InfoType="TIME" />
          <VideoInfo IconName={IconLike} InfoData={video.like_count.toLocaleString()} InfoType="LIKE" />
          <VideoInfo IconName={IconView} InfoData={video.view_count.toLocaleString()} InfoType="VIEW" />
        </div>
        <div className="w-full flex justify-end items-center">
          <button className="p-2 rounded-xl bg-primary font-preSemiBold text-white text-sm">요리하기</button>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
