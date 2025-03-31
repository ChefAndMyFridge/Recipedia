import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

import OpenTimer from "@components/common/timer/OpenTimer";
import IconTimer from "@assets/icons/IconTimer";

const Timer = ({ defaultTimer }: { defaultTimer: number }) => {
  // 상대적 위치 사용 (0~1 사이의 값으로 표현)
  const [relativePosition, setRelativePosition] = useState({ xPercent: 0.05, yPercent: 0.85 });
  const [absolutePosition, setAbsolutePosition] = useState({ x: 0, y: 0 });

  const [isOpen, setIsOpen] = useState(false);

  const [initTimer, setInitTimer] = useState(0);
  const [timer, setTimer] = useState(0);
  const [timerIsRunning, setTimerIsRunning] = useState(false);

  const offset = useRef({ x: 0, y: 0 });
  const timerRef = useRef<HTMLDivElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 컴포넌트 마운트 시 초기 위치 설정
  useEffect(() => {
    updateAbsolutePosition();

    // 화면 크기 변경 이벤트 처리
    function handleResize() {
      updateAbsolutePosition();
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [relativePosition]);

  // 기본 타이머 설정
  useEffect(() => {
    if (defaultTimer > 0) {
      setInitTimer(defaultTimer);
      setTimer(defaultTimer);
    }
  }, [defaultTimer]);

  // 타이머 인터벌 정리
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // 상대적 위치를 절대적 위치로 변환하는 함수
  function updateAbsolutePosition() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const element = timerRef.current;
    const elementWidth = element?.offsetWidth || 50;
    const elementHeight = element?.offsetHeight || 50;

    const maxX = width - elementWidth;
    const maxY = height - elementHeight;

    // 상대적 위치를 절대적 픽셀 위치로 변환
    setAbsolutePosition({
      x: Math.max(0, Math.min(relativePosition.xPercent * width, maxX)),
      y: Math.max(0, Math.min(relativePosition.yPercent * height, maxY)),
    });
  }

  // 드래그 시작
  function handleTouchStart(event: React.TouchEvent<HTMLDivElement>): void {
    const touch = event.touches[0];

    offset.current = {
      x: touch.clientX - absolutePosition.x,
      y: touch.clientY - absolutePosition.y,
    };
  }

  // 드래그 중
  function handleTouchMove(event: React.TouchEvent<HTMLDivElement>): void {
    const touch = event.touches[0];
    const width = window.innerWidth;
    const height = window.innerHeight;

    const element = timerRef.current;
    const elementWidth = element?.offsetWidth || 50;
    const elementHeight = element?.offsetHeight || 50;

    const newX = Math.max(0, Math.min(touch.clientX - offset.current.x, width - elementWidth));
    const newY = Math.max(0, Math.min(touch.clientY - offset.current.y, height - elementHeight));

    // 절대 위치 업데이트
    setAbsolutePosition({ x: newX, y: newY });

    // 상대 위치도 함께 업데이트 (화면 크기 변경 시 사용)
    setRelativePosition({
      xPercent: newX / width,
      yPercent: newY / height,
    });
  }

  // 타이머 작동
  function handleRunTimer() {
    if (timerIsRunning) {
      clearInterval(intervalRef.current as NodeJS.Timeout);
      setTimerIsRunning(false);
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 0) {
          clearInterval(intervalRef.current as NodeJS.Timeout);
          setTimerIsRunning(false);
          setIsOpen(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setTimerIsRunning(true);
  }

  return createPortal(
    <>
      {!isOpen ? (
        <div
          ref={timerRef}
          className="fixed flex justify-between items-center px-4 py-3 gap-2 z-50 bg-subContent/50 backdrop-blur-lg rounded-full cursor-grab active:cursor-grabbing touch-none"
          style={{
            left: `${absolutePosition.x}px`,
            top: `${absolutePosition.y}px`,
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onClick={() => setIsOpen(true)}
        >
          <IconTimer
            width={25}
            height={25}
            strokeColor={timerIsRunning && timer <= 5 ? "#d44848" : "black"}
            isRunning={timerIsRunning}
            percentage={Math.floor((timer / initTimer) * 100)}
          />
          <div
            className={`flex justify-center items-center gap-1 text-xl font-preLight ${timerIsRunning && timer <= 5 ? "text-error" : "text-black"}`}
          >
            <div className="flex items-center justify-center rounded-lg text-xl">
              {String(Math.floor(timer / 3600)).padStart(2, "0")}
            </div>
            :
            <div className="flex items-center justify-center rounded-lg text-xl">
              {String(Math.floor(timer / 60) % 60).padStart(2, "0")}
            </div>
            :
            <div className="flex items-center justify-center rounded-lg text-xl">
              {String(timer % 60).padStart(2, "0")}
            </div>
          </div>
        </div>
      ) : (
        <OpenTimer
          timer={timer}
          timerIsRunning={timerIsRunning}
          setTimer={setTimer}
          setInitTimer={setInitTimer}
          setTimerIsRunning={setTimerIsRunning}
          handleActiveTimer={handleRunTimer}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>,
    document.getElementById("timer") as HTMLElement
  );
};

export default Timer;
