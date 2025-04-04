import ReactPlayer from "react-player";
import { useRef, useState } from "react";

import useModalStore from "@stores/modalStore";
import recipeStore from "@stores/recipeStore";

import IconShare from "@assets/icons/IconShare";

import Header from "@components/Layout/Header";
import Button from "@components/common/button/Button";
import RecipeRatingModal from "@components/recipeRating/RecipeRatingModal";

import RecipeInfos from "@pages/detailRecipe/components/RecipeInfos";
import RecipeTitle from "@pages/detailRecipe/components/RecipeTitle";
import RecipeQrCode from "@pages/detailRecipe/components/RecipeQrCode";

//세로모드 레이아웃
const DetailRecipePortraitPage = () => {
  const { openModal } = useModalStore();

  const [currentTime, setCurrentTime] = useState(0);
  const [qrIsOpen, setQrIsOpen] = useState(false);

  const playerRef = useRef<ReactPlayer>(null);

  const { detailRecipe, resetDetailRecipe, setHasFetchedDetailRecipe } = recipeStore();

  function toRecipeList() {
    //  detailRecipe 초기화
    resetDetailRecipe();
    setHasFetchedDetailRecipe(false);
  }

  return (
    <section className={`relative w-full h-full flex flex-col justify-between items-center gap-2 p-3`}>
      <Header title="레시피" isIcon onClick={toRecipeList} />
      <ReactPlayer
        ref={playerRef}
        url={detailRecipe.url}
        width="100%"
        height="40%"
        playing={true}
        muted={true}
        controls={true}
        light={false}
        pip={true}
        onProgress={(state) => setCurrentTime(state.playedSeconds)}
      />
      <RecipeTitle title={detailRecipe.title} channelTitle={detailRecipe.channelTitle} />

      <RecipeInfos currentTime={currentTime} setCurrentTime={setCurrentTime} playerRef={playerRef} />

      {qrIsOpen && <RecipeQrCode path={window.location.href} onClose={() => setQrIsOpen(false)} />}

      {/* 버튼 컨테이너 */}
      <div className="w-full flex justify-end items-center gap-2.5">
        <button
          className="w-10 h-10 flex justify-center items-center bg-content2 rounded-full"
          onClick={() => setQrIsOpen(true)}
        >
          <IconShare width={18} height={18} strokeColor="white" strokeWidth={2} />
        </button>
        <Button
          type="button"
          design="confirm"
          content="요리 종료"
          className="w-24 h-10"
          onAction={() => openModal(<RecipeRatingModal />)}
        />
      </div>
    </section>
  );
};

export default DetailRecipePortraitPage;
