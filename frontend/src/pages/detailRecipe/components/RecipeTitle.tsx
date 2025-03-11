import { Video } from "@/types/recipeListTypes";

const RecipeTitle = ({ video }: { video: Video }) => {
  return (
    <div className="w-full flex justify-between px-2">
      {/* 영상 제목 및 채널 이름 표시 */}
      <div className="max-w-[65%] flex flex-col gap-1">
        <p className="line-clamp-2 font-preSemiBold text-base">{video.title}</p>
        <p className="text-sm font-preSemiBold text-content">{video.channel_title}</p>
      </div>
      {/* 레시피 보기 버튼 및 토글버튼 표시 */}
      <div className="w-[30%] flex justify-center">
        <p className="text-sm font-preSemiBold text-content">레시피 보기 </p>
        <p>토글버튼</p>
      </div>
    </div>
  );
};

export default RecipeTitle;
