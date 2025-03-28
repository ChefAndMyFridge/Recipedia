import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

import OpenTimer from "@components/common/timer/OpenTimer";

import IconTimer from "@assets/icons/IconTimer";

const Timer = () => {
  const [position, setPosition] = useState({ x: 0, y: 100 }); // 초기 위치
  const [isDragging, setIsDragging] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timerIsRunning, setTimerIsRunning] = useState(false);

  const timerRef = useRef<HTMLDivElement | null>(null);
  const offset = useRef({ x: 0, y: 0 });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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
    setIsDragging(true);

    const touch = event.touches[0];
    offset.current = {
      x: touch.clientX - position.x,
      y: touch.clientY - position.y,
    };
  }

  //드래그 중
  function handleTouchMove(event: TouchEvent): void {
    if (!isDragging) return;

    // 새로운 위치 계산
    const touch = event.touches[0];

    const newX = touch.clientX - offset.current.x;
    const newY = touch.clientY - offset.current.y;

    // 화면 범위를 벗어나지 않도록 제한
    setPosition(clampPosition(newX, newY));
  }

  // 드래그 종료
  function handleTouchEnd(): void {
    setIsDragging(false);
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

  // 이벤트 등록 / 해제
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleTouchEnd);
    } else {
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    }

    return () => {
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging]);

  return createPortal(
    <>
      {!isOpen ? (
        <div
          ref={timerRef}
          className="fixed p-2.5 z-50 bg-black/50 rounded-full cursor-grab active:cursor-grabbing touch-none"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
          }}
          onTouchStart={handleTouchStart}
          onClick={() => setIsOpen(true)}
        >
          <IconTimer width={25} height={25} strokeColor="white" />
        </div>
      ) : (
        <OpenTimer
          timer={timer}
          timerIsRunning={timerIsRunning}
          setTimer={setTimer}
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
