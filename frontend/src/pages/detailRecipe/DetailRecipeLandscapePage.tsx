import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import useModalStore from "@stores/modalStore";
import VideoInfos from "@components/common/videoInfo/VideoInfos";
import Header from "@components/Layout/Header";
import Button from "@components/common/button/Button";
import RecipeRatingModal from "@components/recipeRating/RecipeRatingModal";
import Modal from "@components/common/modal/Modal";
import ErrorPage from "@components/common/error/ErrorPage";
import RecipeInfos from "@pages/detailRecipe/components/RecipeInfos";
import RecipeTitle from "@pages/detailRecipe/components/RecipeTitle";
import RecipeTexts from "@pages/detailRecipe/components/RecipeTexts";
import recipeStore from "@stores/recipeStore";

//가로모드 레이아웃
const DetailRecipeLandscapePage = () => {
  const { openModal } = useModalStore();
  const navigate = useNavigate();
  const [isRecipeOpen, setIsRecipeOpen] = useState<boolean>(false);

  const { recipeList, detailRecipe, findRecipeVideo } = recipeStore();
  const { recipeId } = useParams();

  if (Object.keys(recipeList.videos).length === 0 || detailRecipe.title === "") {
    return <ErrorPage />;
  }

  //recipeId를 통해 레시피 영상 정보 조회
  const video = findRecipeVideo(recipeList, Number(recipeId));
  return (
    <>
      <section className={`w-full h-full flex flex-col justify-start items-center gap-2 p-3`}>
        <Header title="레시피" isIcon />
        <div className="h-full pb-10 flex gap-8">
          <div className="w-[60%] h-full flex flex-col justify-between">
            <ReactPlayer
              url={video.url}
              width="100%"
              height="50%"
              playing={true}
              muted={true}
              controls={true}
              light={false}
              pip={true}
            />
            <RecipeTitle video={video} isRecipeOpen={isRecipeOpen} setIsRecipeOpen={setIsRecipeOpen} />
            <VideoInfos video={video} />
          </div>

          <div className="w-[35%] h-full flex flex-col justify-between">
            <div className="h-[70%]">
              {isRecipeOpen ? <RecipeTexts recipe={detailRecipe.cooking_sequence} /> : <RecipeInfos />}
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
      <Modal />
    </>
  );
};

export default DetailRecipeLandscapePage;
