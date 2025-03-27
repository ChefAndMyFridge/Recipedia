import { useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";

import useModalStore from "@stores/modalStore";
import recipeStore from "@stores/recipeStore";

import Header from "@components/Layout/Header";
import Button from "@components/common/button/Button";
import RecipeRatingModal from "@components/recipeRating/RecipeRatingModal";

import RecipeInfos from "@pages/detailRecipe/components/RecipeInfos";
import RecipeTitle from "@pages/detailRecipe/components/RecipeTitle";

//세로모드 레이아웃
const DetailRecipePortraitPage = () => {
  const { openModal } = useModalStore();
  const navigate = useNavigate();

  const { detailRecipe } = recipeStore();

  return (
    <section className={`w-full h-full flex flex-col justify-start items-center gap-2 p-3`}>
      <Header title="레시피" isIcon />
      <ReactPlayer
        url={detailRecipe.url}
        width="100%"
        height="40%"
        playing={true}
        muted={true}
        controls={true}
        light={false}
        pip={true}
      />
      <RecipeTitle title={detailRecipe.title} channelTitle={detailRecipe.channelTitle} />

      <RecipeInfos />

      {/* 버튼 컨테이너 */}
      <div className="w-full flex justify-end items-center gap-2">
        <Button type="button" design="cancel" content="요리 취소" className="w-28 h-8" onAction={() => navigate(-1)} />
        <Button
          type="button"
          design="confirm"
          content="요리 종료"
          className="w-28 h-8"
          onAction={() => openModal(<RecipeRatingModal />)}
        />
      </div>
    </section>
  );
};

export default DetailRecipePortraitPage;
