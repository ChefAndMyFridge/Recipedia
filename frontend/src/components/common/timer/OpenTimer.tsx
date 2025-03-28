import React, { useState, useEffect } from "react";

import IconClose from "@assets/icons/IconClose";

interface TimerProps {
  timer: number;
  timerIsRunning: boolean;
  setTimer: (seconds: number) => void;
  setTimerIsRunning: (isRunning: boolean) => void;
  handleActiveTimer: () => void;
  onClose: () => void;
}

const OpenTimer = ({ timer, timerIsRunning, setTimer, setTimerIsRunning, handleActiveTimer, onClose }: TimerProps) => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [startY, setStartY] = useState(0);

  // 시간 변경
  function changeValue(type: "hours" | "minutes" | "seconds", step: number) {
    if (type === "hours") {
      setHours((prev) => Math.max(0, Math.min(prev + step, 99))); // 0~99 제한
    } else if (type === "minutes") {
      setMinutes((prev) => (prev + step + 60) % 60); // 0~59 순환
    } else if (type === "seconds") {
      setSeconds((prev) => (prev + step + 60) % 60); // 0~59 순환
    }
  }

  // 터치 시작
  function handleTouchStart(event: React.TouchEvent<HTMLDivElement>) {
    setStartY(event.touches[0].clientY);
  }

  // 터치 이동
  function handleTouchMove(event: React.TouchEvent<HTMLDivElement>, type: "hours" | "minutes" | "seconds") {
    const deltaY = startY - event.touches[0].clientY;

    if (Math.abs(deltaY) > 10) {
      const step = deltaY > 0 ? 1 : -1;
      changeValue(type, step);
      setStartY(event.touches[0].clientY); // 새로운 기준점 업데이트
    }
  }

  // 설정 버튼 클릭 시 초 단위 변환 후 타이머 작동
  function handleSetTimer() {
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    if (totalSeconds === 0) return;

    setTimer(totalSeconds);
    setTimerIsRunning(true);
    handleActiveTimer();
  }

  function handleStopTimer() {
    setTimerIsRunning(false);
    handleActiveTimer();
  }

  useEffect(() => {
    setHours(Math.floor(timer / 3600));
    setMinutes(Math.floor(timer / 60) % 60);
    setSeconds(timer % 60);
  }, [timer]);

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-[75vw] h-[30vh] pb-6 flex flex-col justify-between bg-subContent/95 text-black rounded-2xl shadow-lg">
      <div className="flex justify-end items-center font-preSemiBold">
        <IconClose width={50} height={50} strokeColor="black" strokeWidth={1} onClick={onClose} />
      </div>

      {/* 시간, 분, 초 */}
      {!timerIsRunning && (
        <div className="flex justify-center items-center px-5 gap-2 text-3xl font-preLight">
          <div
            className="w-16 h-16 flex items-center justify-center rounded-lg text-5xl"
            onTouchStart={handleTouchStart}
            onTouchMove={(event) => handleTouchMove(event, "hours")}
          >
            {String(hours).padStart(2, "0")}
          </div>
          :
          <div
            className="w-16 h-16 flex items-center justify-center rounded-lg text-5xl"
            onTouchStart={handleTouchStart}
            onTouchMove={(event) => handleTouchMove(event, "minutes")}
          >
            {String(minutes).padStart(2, "0")}
          </div>
          :
          <div
            className="w-16 h-16 flex items-center justify-center rounded-lg text-5xl"
            onTouchStart={handleTouchStart}
            onTouchMove={(event) => handleTouchMove(event, "seconds")}
          >
            {String(seconds).padStart(2, "0")}
          </div>
        </div>
      )}
      {timerIsRunning && (
        <div className="flex justify-center items-center px-5 gap-2 text-3xl font-preLight">
          <div className="w-16 h-16 flex items-center justify-center rounded-lg text-5xl">
            {String(Math.floor(timer / 3600)).padStart(2, "0")}
          </div>
          :
          <div className="w-16 h-16 flex items-center justify-center rounded-lg text-5xl">
            {String(Math.floor(timer / 60) % 60).padStart(2, "0")}
          </div>
          :
          <div className="w-16 h-16 flex items-center justify-center rounded-lg text-5xl">
            {String(timer % 60).padStart(2, "0")}
          </div>
        </div>
      )}

      {/* 설정 버튼 */}
      <button
        onClick={timerIsRunning ? handleStopTimer : handleSetTimer}
        className={`block mx-6 px-6 py-2 rounded-3xl font-preBold text-white ${timerIsRunning ? "bg-error" : "bg-primaryLight"}`}
      >
        {timerIsRunning ? "중지" : "시작"}
      </button>
    </div>
  );
};

export default OpenTimer;
