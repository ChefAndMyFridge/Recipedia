import { useEffect, useState } from "react";

import book from "@assets/images/loading/book.gif";
import cutting from "@assets/images/loading/cutting.gif";
import egg from "@assets/images/loading/egg.gif";
import fritada from "@assets/images/loading/fritada.gif";
import pot from "@assets/images/loading/pot.gif";
import ricebowl from "@assets/images/loading/ricebowl.gif";

const loadingImageList = [book, cutting, egg, fritada, pot, ricebowl];

const LoadingPlayer = () => {
  const [currentImage, setCurrentImage] = useState(loadingImageList[0]);
  const [fade, setFade] = useState(true);
  const [corner, setCorner] = useState({ x: 50, y: 50 });

  // 이미지 변경 및 페이드 효과 적용
  useEffect(() => {
    const changeImage = () => {
      setFade(false);
      setTimeout(() => {
        // 랜덤으로 이미지 변경
        const nextImage = loadingImageList[Math.floor(Math.random() * loadingImageList.length)];
        setCurrentImage(nextImage);
        setFade(true);
      }, 800);
    };

    const interval = setInterval(changeImage, 2500);
    return () => clearInterval(interval);
  }, []);

  // 페이드 효과를 위한 랜덤 좌표 생성
  useEffect(() => {
    setCorner({ x: Math.random() * 100, y: Math.random() * 100 });
  }, [currentImage]);

  return (
    <div className="relative flex justify-center items-center w-full h-fit bg-white overflow-hidden">
      <img
        src={currentImage}
        alt="Random GIF"
        className="w-[50vw]"
        style={{
          clipPath: fade ? `circle(150% at ${corner.x}% ${corner.y}%)` : `circle(0% at ${corner.x}% ${corner.y}%)`,
          transition: "clip-path 0.8s ease",
        }}
      />
    </div>
  );
};

export default LoadingPlayer;
