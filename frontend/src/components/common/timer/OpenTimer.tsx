import React, { useState, useEffect } from "react";

import IconClose from "@assets/icons/IconClose";

interface TimerProps {
  timer: number;
  timerIsRunning: boolean;
  setTimer: (seconds: number) => void;
  setInitTimer: (seconds: number) => void;
  setTimerIsRunning: (isRunning: boolean) => void;
  handleActiveTimer: () => void;
  onClose: () => void;
}

const OpenTimer = ({
  timer,
  timerIsRunning,
  setTimer,
  setInitTimer,
  setTimerIsRunning,
  handleActiveTimer,
  onClose,
}: TimerProps) => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [startY, setStartY] = useState(0);

  // 시간 변경
  function changeValue(type: "hours" | "minutes" | "seconds", step: number) {
    if (type === "hours") {
      setHours((prev) => (prev + step + 100) % 100); // 0~99 제한
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

    setInitTimer(totalSeconds); // 초기 타이머 값 설정
    setTimer(totalSeconds); // 타이머 값 설정
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
    <div
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-[70vw] h-fit pb-6 flex flex-col gap-2 justify-between bg-subContent/50 backdrop-blur-lg
 text-black rounded-2xl shadow-lg"
    >
      <div className="flex justify-end items-center font-preSemiBold">
        <IconClose width={50} height={50} strokeColor="black" strokeWidth={1} onClick={onClose} />
      </div>

      {/* 시간, 분, 초 */}
      {!timerIsRunning && (
        <div className="flex justify-center items-center gap-1.5 text-xl text-longContent font-preLight">
          <div
            className="w-16 h-48 flex flex-col items-center justify-center gap-0.5 rounded-lg"
            onTouchStart={handleTouchStart}
            onTouchMove={(event) => handleTouchMove(event, "hours")}
          >
            <span>{String((hours + 98) % 100).padStart(2, "0")}</span>

            <span>{String((hours + 99) % 100).padStart(2, "0")}</span>
            <span className="text-5xl text-black my-0.5">{String(hours).padStart(2, "0")}</span>
            <span>{String((hours + 1) % 100).padStart(2, "0")}</span>
            <span>{String((hours + 2) % 100).padStart(2, "0")}</span>
          </div>
          <span className="text-5xl text-black">:</span>
          <div
            className="w-16 h-48 flex flex-col items-center justify-center gap-0.5 rounded-lg"
            onTouchStart={handleTouchStart}
            onTouchMove={(event) => handleTouchMove(event, "minutes")}
          >
            <span>{String((minutes + 58) % 60).padStart(2, "0")}</span>

            <span>{String((minutes + 59) % 60).padStart(2, "0")}</span>
            <span className="text-5xl text-black my-0.5">{String(minutes).padStart(2, "0")}</span>
            <span>{String((minutes + 1) % 60).padStart(2, "0")}</span>
            <span>{String((minutes + 2) % 60).padStart(2, "0")}</span>
          </div>
          <span className="text-5xl text-black">:</span>
          <div
            className="w-16 h-48 flex flex-col items-center justify-center gap-0.5 rounded-lg"
            onTouchStart={handleTouchStart}
            onTouchMove={(event) => handleTouchMove(event, "seconds")}
          >
            <span>{String((seconds + 58) % 60).padStart(2, "0")}</span>

            <span>{String((seconds + 59) % 60).padStart(2, "0")}</span>
            <span className="text-5xl text-black my-0.5">{String(seconds).padStart(2, "0")}</span>
            <span>{String((seconds + 1) % 60).padStart(2, "0")}</span>
            <span>{String((seconds + 2) % 60).padStart(2, "0")}</span>
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
        className={`block mx-6 mt-3 px-6 py-2 rounded-3xl font-preBold text-white ${timerIsRunning ? "bg-error" : "bg-primaryLight"}`}
      >
        {timerIsRunning ? "중지" : "시작"}
      </button>
    </div>
  );
};

export default OpenTimer;
