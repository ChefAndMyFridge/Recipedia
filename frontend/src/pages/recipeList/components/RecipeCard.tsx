import IconHeart from "@/assets/icons/IconHeart";
import { Video } from "@/types/recipeListTypes";

interface RecipeCardProps {
  video: Video;
}

const RecipeCard = ({ video }: RecipeCardProps) => {
  return (
    <div className={`w-full shrink-0 flex justify-center`}>
      <div className="w-[70%] p-3 flex flex-col gap-3 bg-white rounded-2xl">
        <img
          src="https://i.ytimg.com/vi/F5eBeXuI3ZU/maxresdefault.jpg"
          alt={video.title}
          className="w-full h-[60%] rounded-xl"
        />
        <div className="flex justify-between gap-2 h-[20%]">
          <p className="font-preSemiBold text-sm break-keep">{video.title}</p>
          <button className="text-sm">
            <IconHeart width={30} height={30} strokeColor="black" />
          </button>
        </div>
        <div>Video info</div>
        <div className="w-full flex justify-end">
          <button className="p-2 rounded-xl bg-primary font-preSemiBold text-white text-sm">요리하기</button>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
