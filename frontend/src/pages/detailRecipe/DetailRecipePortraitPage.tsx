import ReactPlayer from "react-player";
import { useEffect, useRef, useState } from "react";

import useModalStore from "@stores/modalStore";
import recipeStore from "@stores/recipeStore";

import Header from "@components/Layout/Header";
import Button from "@components/common/button/Button";
import RecipeRatingModal from "@components/recipeRating/RecipeRatingModal";
import TimerManager from "@components/common/timer/TimerManager";

import RecipeInfos from "@pages/detailRecipe/components/RecipeInfos";
import RecipeTitle from "@pages/detailRecipe/components/RecipeTitle";

//세로모드 레이아웃
const DetailRecipePortraitPage = () => {
  const { openModal } = useModalStore();

  const playerRef = useRef<ReactPlayer>(null);

  const [currentTime, setCurrentTime] = useState(0);

  const { detailRecipe, resetDetailRecipe, setHasFetchedDetailRecipe } = recipeStore();

  // 레시피 타이머 추출
  const [recipeTimers, setRecipeTimers] = useState<{ step: string; timer: number }[]>([]);

  function toRecipeList() {
    resetDetailRecipe();
    setHasFetchedDetailRecipe(false);
  }

  // 레시피에서 타이머 정보 추출
  useEffect(() => {
    if (!detailRecipe.textRecipe) return;

    const timers: { step: string; timer: number }[] = [];

    detailRecipe.textRecipe.cooking_sequence &&
      Object.entries(detailRecipe.textRecipe.cooking_sequence).forEach(([key, value]) => {
        if (value.timer > 0) {
          timers.push({
            step: key,
            timer: value.timer,
          });
        }
      });

    setRecipeTimers(timers);
  }, [detailRecipe.textRecipe]);

  return (
    <section className={`w-full h-full flex flex-col justify-between items-center gap-2 p-3`}>
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

      {/* 버튼 컨테이너 */}
      <div className="w-full flex justify-between items-center">
        <TimerManager recipeTimers={recipeTimers} position={{ xPercent: 0.15, yPercent: 0.915 }} />
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
