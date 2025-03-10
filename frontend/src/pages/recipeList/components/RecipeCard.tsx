import IconClock from "@assets/icons/IconClock";
import IconHeart from "@assets/icons/IconHeart";
import IconLike from "@assets/icons/IconLike";
import IconView from "@assets/icons/IconView";
import { Video } from "@/types/recipeListTypes";
import { getYoutubeThumbnailUrl } from "@utils/getYoutubeThumbnailUrl";

interface RecipeCardProps {
  video: Video;
}

const RecipeCard = ({ video }: RecipeCardProps) => {
  const thumbnailUrl = getYoutubeThumbnailUrl(video.url);
  return (
    <div className={`flex justify-center`}>
      <div className="w-[80%] h-[60vh] min-h-[450px] p-3 flex flex-col justify-between bg-white rounded-2xl">
        <img src={thumbnailUrl} alt={video.title} className="w-full h-[45%] min-h-[200px] rounded-xl object-cover" />
        <div className="flex justify-between items-center">
          <p className="max-w-[90%] overflow-hidden text-ellipsis whitespace-nowrap font-preSemiBold text-base break-keep">
            {video.title}
          </p>
          <button className="text-sm">
            <IconHeart width={30} height={30} strokeColor="black" />
          </button>
        </div>
        <div className="flex justify-around items-center">
          <div className="flex flex-col gap-1 justify-center items-center text-sm">
            <IconClock width={45} height={45} strokeColor="black" />
            <p className="font-preBold">{video.duration}</p>
            <p className="font-preRegular">TIME</p>
          </div>
          <div className="flex flex-col gap-1 justify-center items-center text-sm">
            <IconLike width={45} height={45} strokeColor="black" />
            <p className="font-preBold">{video.like_count.toLocaleString()}</p>
            <p className="font-preRegular">LIKE</p>
          </div>
          <div className="flex flex-col gap-1 justify-center items-center text-sm">
            <IconView width={45} height={45} strokeColor="black" />
            <p className="font-preBold">{video.view_count.toLocaleString()}</p>
            <p className="font-preRegular">VIEW</p>
          </div>
        </div>
        <div className="w-full flex justify-end items-center">
          <button className="p-2 rounded-xl bg-primary font-preSemiBold text-white text-sm">요리하기</button>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
