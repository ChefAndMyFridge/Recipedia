import ReactPlayer from "react-player";
import { useEffect, useRef, useState } from "react";

import useModalStore from "@stores/modalStore";
import recipeStore from "@stores/recipeStore";

import Header from "@components/Layout/Header";
import Button from "@components/common/button/Button";
import RecipeRatingModal from "@components/recipeRating/RecipeRatingModal";
import TimerCarousel from "@components/common/timer/TimerCarousel";

import RecipeInfos from "@pages/detailRecipe/components/RecipeInfos";
import RecipeTitle from "@pages/detailRecipe/components/RecipeTitle";

import IconTimer from "@assets/icons/IconTimer";

interface TimerInfo {
  step: string;
  timer: number;
  currentTimer?: number;
  isRunning?: boolean;
}

//세로모드 레이아웃
const DetailRecipePortraitPage = () => {
  const { openModal } = useModalStore();

  const playerRef = useRef<ReactPlayer>(null);

  const { detailRecipe, resetDetailRecipe, setHasFetchedDetailRecipe } = recipeStore();

  //타이머 관련
  const [timers, setTimers] = useState<TimerInfo[]>([]); // 타이머 배열
  const [currentTime, setCurrentTime] = useState(0); // 현재 시간
  const [timerListOpen, setTimerListOpen] = useState(false); // 타이머 목록 열림 여부

  const timerIntervals = useRef<{ [key: string]: NodeJS.Timeout }>({}); // 타이머 인터벌 ref

  function toRecipeList() {
    //  detailRecipe 초기화
    resetDetailRecipe();
    setHasFetchedDetailRecipe(false);
  }

  // 타이머 카운트다운 시작
  function startTimerCountdown(step: string) {
    // 이미 실행 중인 타이머가 있으면 정리
    if (timerIntervals.current[step]) {
      clearInterval(timerIntervals.current[step]);
    }

    // 새 인터벌 설정
    timerIntervals.current[step] = setInterval(() => {
      setTimers((prev) =>
        prev.map((timer) => {
          if (timer.step === step && timer.isRunning) {
            const currentValue = timer.currentTimer ?? timer.timer;
            const newValue = currentValue > 0 ? currentValue - 1 : 0;

            // 타이머가 0에 도달하면 정지
            if (newValue === 0) {
              clearInterval(timerIntervals.current[step]);
              delete timerIntervals.current[step];
              return { ...timer, currentTimer: newValue, isRunning: false };
            }

            return { ...timer, currentTimer: newValue };
          }
          return timer;
        })
      );
    }, 1000);
  }

  // 타이머 정지
  function stopTimerCountdown(step: string) {
    if (timerIntervals.current[step]) {
      clearInterval(timerIntervals.current[step]);
      delete timerIntervals.current[step];
    }
  }

  // 타이머 상태 업데이트 핸들러
  function handleTimerUpdate(step: string, data: { currentTimer: number; isRunning: boolean }) {
    setTimers((prev) =>
      prev.map((timer) => {
        if (timer.step === step) {
          // 타이머 상태 변경
          if (data.isRunning && !timer.isRunning) {
            // 타이머 시작
            startTimerCountdown(step);
          } else if (!data.isRunning && timer.isRunning) {
            // 타이머 정지
            stopTimerCountdown(step);
          }

          return {
            ...timer,
            currentTimer: data.currentTimer,
            isRunning: data.isRunning,
          };
        }
        return timer;
      })
    );
  }

  // 컴포넌트 마운트 시 레시피 데이터에서 타이머 추출
  useEffect(() => {
    if (!detailRecipe.textRecipe) return;

    const newTimers: TimerInfo[] = [];

    detailRecipe.textRecipe.cooking_sequence &&
      Object.entries(detailRecipe.textRecipe.cooking_sequence).forEach(([key, value]) => {
        if (value.timer > 0) {
          newTimers.push({
            step: key,
            timer: value.timer,
            currentTimer: value.timer,
            isRunning: false,
          });
        }
      });

    // 이전 타이머 상태와 병합
    setTimers((prev) => {
      // 기존 타이머의 상태 유지
      const existingTimers = prev.filter((oldTimer) => newTimers.some((newTimer) => newTimer.step === oldTimer.step));

      // 새 타이머 추가
      const addedTimers = newTimers.filter(
        (newTimer) => !existingTimers.some((oldTimer) => oldTimer.step === newTimer.step)
      );

      return [...existingTimers, ...addedTimers];
    });
  }, [detailRecipe.textRecipe]);

  // 컴포넌트 언마운트 시 모든 타이머 정리
  useEffect(() => {
    return () => {
      Object.keys(timerIntervals.current).forEach((key) => {
        clearInterval(timerIntervals.current[key]);
      });
      timerIntervals.current = {};
    };
  }, []);

  // 새 타이머 추가 핸들러
  function handleAddTimer(newTimer: { step: string; timer: number }) {
    // 새 타이머 추가
    setTimers((prev) => [
      ...prev,
      {
        ...newTimer,
        currentTimer: newTimer.timer,
        isRunning: false,
      },
    ]);
  }

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
        <div className="relative">
          <div
            className="bg-subContent/50 rounded-full p-3 cursor-pointer"
            onClick={() => setTimerListOpen(!timerListOpen)}
          >
            <IconTimer
              width={24}
              height={24}
              strokeColor="black"
              isRunning={timers.some((timer) => timer.isRunning)}
              percentage={50}
            />
            {timers.length > 0 && <div className="absolute top-0 right-1 bg-red-500 rounded-full w-3 h-3"></div>}
          </div>
        </div>
        <Button
          type="button"
          design="confirm"
          content="요리 종료"
          className="w-28 h-8"
          onAction={() => openModal(<RecipeRatingModal />)}
        />
      </div>

      {/* TimerCarousel 컴포넌트 */}
      {timerListOpen && <TimerCarousel timers={timers} onAddTimer={handleAddTimer} onTimerUpdate={handleTimerUpdate} />}
    </section>
  );
};

export default DetailRecipePortraitPage;
