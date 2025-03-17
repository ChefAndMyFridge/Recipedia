import { useEffect, useState, useMemo } from "react";

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

  // useMemo를 사용해 이미지 변경 시에만 새로운 좌표 생성
  const corner = useMemo(() => ({ x: Math.random() * 100, y: Math.random() * 100 }), [currentImage]);

  // 이미지 변경 및 fade 효과
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);

      setTimeout(() => {
        let newImage;
        do {
          newImage = loadingImageList[Math.floor(Math.random() * loadingImageList.length)];
        } while (newImage === currentImage);

        setCurrentImage(newImage);
        setFade(true);
      }, 800);
    }, 2500);

    return () => clearInterval(interval);
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
