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

//가로모드 레이아웃
const DetailRecipeLandscapePage = () => {
  const { openModal } = useModalStore();

  const [currentTime, setCurrentTime] = useState(0);

  const playerRef = useRef<ReactPlayer>(null);

  const { detailRecipe, resetDetailRecipe, setHasFetchedDetailRecipe } = recipeStore();

  // 레시피 타이머 추출
  const [recipeTimers, setRecipeTimers] = useState<{ step: string; timer: number }[]>([]);

  function toRecipeList() {
    //  detailRecipe 초기화
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
    <section className={`w-full h-full flex flex-col justify-start items-center gap-2 p-3`}>
      <Header title="레시피" isIcon onClick={toRecipeList} />
      <div className="h-[90%] flex gap-8">
        <div className="w-[60%] h-full flex flex-col justify-start gap-5">
          <ReactPlayer
            ref={playerRef}
            url={detailRecipe.url}
            width="100%"
            height="70%"
            playing={true}
            muted={true}
            controls={true}
            light={false}
            pip={true}
            onProgress={(state) => setCurrentTime(state.playedSeconds)}
          />
          <RecipeTitle title={detailRecipe.title} channelTitle={detailRecipe.channelTitle} />
        </div>

        <div className="w-[35%] h-full flex flex-col justify-between">
          <RecipeInfos currentTime={currentTime} setCurrentTime={setCurrentTime} playerRef={playerRef} />

          {/* 버튼 컨테이너 */}
          <div className="w-full flex justify-end items-center gap-2">
            <TimerManager recipeTimers={recipeTimers} position={{ xPercent: 0.575, yPercent: 0.915 }} />
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
