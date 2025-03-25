import Toggle from "@components/common/toggle/Toggle";
import { Video } from "@/types/recipeListTypes";

interface RecipeTitleProps {
  video: Video;
  isRecipeOpen: boolean;
  setIsRecipeOpen: (isRecipeOpen: boolean) => void;
}

const RecipeTitle = ({ video, isRecipeOpen, setIsRecipeOpen }: RecipeTitleProps) => {
  return (
    <div className="w-full flex justify-between px-2">
      {/* 영상 제목 및 채널 이름 표시 */}
      <div className="max-w-[65%] flex flex-col gap-1">
        <p className="line-clamp-2 font-preSemiBold text-base landscape:text-sm">{video.title}</p>
        <p className="text-sm landscape:text-xs font-preSemiBold text-content">{video.channelTitle}</p>
      </div>
      {/* 레시피 보기 버튼 및 토글버튼 표시 */}
      <div className="w-[30%] flex justify-end items-start">
        <div className="flex items-center gap-2">
          <p className="w-[50%] text-xs landscape:text-xs font-preSemiBold text-content">레시피 보기 </p>
          <Toggle isToggle={isRecipeOpen} onToggle={setIsRecipeOpen} />
        </div>
      </div>
    </div>
  );
};

export default RecipeTitle;
