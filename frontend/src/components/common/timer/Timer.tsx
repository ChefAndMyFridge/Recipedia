import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

import OpenTimer from "@components/common/timer/OpenTimer";

import IconTimer from "@assets/icons/IconTimer";

const Timer = ({ defaultTimer }: { defaultTimer: number }) => {
  const [position, setPosition] = useState({ x: 0, y: 100 }); // 초기 위치

  const [isOpen, setIsOpen] = useState(false);
  const [initTimer, setInitTimer] = useState(0);
  const [timer, setTimer] = useState(0);
  const [timerIsRunning, setTimerIsRunning] = useState(false);

  const timerRef = useRef<HTMLDivElement | null>(null);
  const offset = useRef({ x: 0, y: 0 });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 마운트 될때 위치 조정
  useEffect(() => {
    if (timerRef.current) {
      setPosition((prev) => clampPosition(prev.x, prev.y));
    }
  }, []);

  // Timer 컴포넌트가 언마운트될 때 interval 해제해 메모리 누수 방지
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // 기본 설정 타이머 값이 있다면 시간 설정
  useEffect(() => {
    if (defaultTimer > 0) {
      setInitTimer(defaultTimer);
      setTimer(defaultTimer);
    }
  }, [defaultTimer]);

  // 화면 크기 가져오기
  function getBounds(): { minX: number; maxX: number; minY: number; maxY: number } {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const element = timerRef.current;
    const elementWidth = element?.offsetWidth || 50; // 기본 크기
    const elementHeight = element?.offsetHeight || 50;

    return {
      minX: 0,
      maxX: width - elementWidth,
      minY: 0,
      maxY: height - elementHeight,
    };
  }

  // 위치 제한 함수
  function clampPosition(x: number, y: number): { x: number; y: number } {
    const bounds = getBounds();
    return {
      x: Math.min(Math.max(x, bounds.minX), bounds.maxX),
      y: Math.min(Math.max(y, bounds.minY), bounds.maxY),
    };
  }

  // 드래그 시작
  function handleTouchStart(event: React.TouchEvent<HTMLDivElement>): void {
    const touch = event.touches[0];
    offset.current = {
      x: touch.clientX - position.x,
      y: touch.clientY - position.y,
    };
  }

  //드래그 중
  function handleTouchMove(event: React.TouchEvent<HTMLDivElement>): void {
    // 새로운 위치 계산
    const touch = event.touches[0];

    const newX = touch.clientX - offset.current.x;
    const newY = touch.clientY - offset.current.y;

    // 화면 범위를 벗어나지 않도록 제한
    setPosition(clampPosition(newX, newY));
  }

  // 타이머 작동
  function handleRunTimer() {
    if (timerIsRunning) {
      clearInterval(intervalRef.current as NodeJS.Timeout); // 기존 interval 해제
      setTimerIsRunning(false); // 타이머 중지
      setTimer((prev) => {
        return prev;
      });
      return;
    }

    // 타이머가 시작되면 새로 interval 설정
    intervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 0) {
          clearInterval(intervalRef.current as NodeJS.Timeout);
          setTimerIsRunning(false); // 타이머 종료
          setIsOpen(true); // 타이머 창 열기
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    setTimerIsRunning(true); // 타이머 실행 상태로 변경
  }

  return createPortal(
    <>
      {!isOpen ? (
        <div
          ref={timerRef}
          className="fixed flex justify-between items-center px-4 py-3 gap-2 z-50 bg-subContent/50 backdrop-blur-lg rounded-full cursor-grab active:cursor-grabbing touch-none"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
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
