import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";

import useModalStore from "@stores/modalStore";
import recipeStore from "@stores/recipeStore";

import VideoInfos from "@components/common/videoInfo/VideoInfos";
import Header from "@components/Layout/Header";
import Button from "@components/common/button/Button";
import RecipeRatingModal from "@components/recipeRating/RecipeRatingModal";

import RecipeInfos from "@pages/detailRecipe/components/RecipeInfos";
import RecipeTitle from "@pages/detailRecipe/components/RecipeTitle";
import RecipeTexts from "@pages/detailRecipe/components/RecipeTexts";

//가로모드 레이아웃
const DetailRecipeLandscapePage = () => {
  const { openModal } = useModalStore();
  const navigate = useNavigate();
  const [isRecipeOpen, setIsRecipeOpen] = useState<boolean>(false);

  const { detailRecipe } = recipeStore();
  return (
    <section className={`w-full h-full flex flex-col justify-start items-center gap-2 p-3`}>
      <Header title="레시피" isIcon />
      <div className="h-full pb-10 flex gap-8">
        <div className="w-[60%] h-full flex flex-col justify-between gap-2">
          <ReactPlayer
            url={detailRecipe.url}
            width="100%"
            height="80%"
            playing={true}
            muted={true}
            controls={true}
            light={false}
            pip={true}
          />
          <RecipeTitle
            title={detailRecipe.title}
            channelTitle={detailRecipe.channelTitle}
            isRecipeOpen={isRecipeOpen}
            setIsRecipeOpen={setIsRecipeOpen}
          />
          <VideoInfos
            duration={detailRecipe.duration}
            viewCount={detailRecipe.viewCount}
            likeCount={detailRecipe.likeCount}
          />
        </div>

        <div className="w-[35%] h-full flex flex-col justify-between">
          <div className="h-[70%]">
            {isRecipeOpen ? <RecipeTexts recipe={detailRecipe.textRecipe.cooking_sequence} /> : <RecipeInfos />}
          </div>

          {/* 버튼 컨테이너 */}
          <div className="w-full flex justify-end items-center gap-2">
            <Button
              type="button"
              design="cancel"
              content="요리 취소"
              className="px-3 py-2"
              onAction={() => navigate(-1)}
            />
            <Button
              type="button"
              design="confirm"
              content="요리 종료"
              className="px-3 py-2"
              onAction={() => openModal(<RecipeRatingModal />)}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DetailRecipeLandscapePage;
