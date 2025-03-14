import { useNavigate } from "react-router-dom";
import { Video } from "@/types/recipeListTypes";
import Button from "@components/common/button/Button";
import VideoInfoRows from "@components/common/videoInfo/VideoInfoRows";

const MyRecipeItem = ({ recipe }: { recipe: Video }) => {
  const navigate = useNavigate();

  return (
    <div
      key={recipe.recipeId}
      className="w-[90%] h-24 bg-white rounded-xl shadow-md flex flex-col items-start p-4 gap-4"
    >
      <div className="flex justify-between items-center w-full">
        <p className="w-[60%] font-preBold text-xl overflow-hidden text-ellipsis whitespace-nowrap">{recipe.title}</p>
        <Button
          type="button"
          design="confirm"
          content="요리하기"
          onAction={() => navigate(`/detailRecipe/${recipe.recipeId}`)}
          className="px-3 py-1"
        />
      </div>
      <VideoInfoRows video={recipe} />
    </div>
  );
};

export default MyRecipeItem;
