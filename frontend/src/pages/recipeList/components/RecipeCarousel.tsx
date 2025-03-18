import { useState } from "react";
import { Video } from "@/types/recipeListTypes";
import RecipeCard from "@pages/recipeList/components/RecipeCard";

interface RecipeCarouselProps {
  videos: Video[];
}

const RecipeCarousel = ({ videos }: RecipeCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  //이전으로
  function goToPrevious() {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? videos.length - 1 : prevIndex - 1));
  }

  //다음으로
  function goToNext() {
    setCurrentIndex((prevIndex) => (prevIndex === videos.length - 1 ? 0 : prevIndex + 1));
  }

  return (
    <div className="relative flex flex-col gap-8 justify-center items-center flex-[3]">
      <div className="overflow-hidden w-full">
        <div
          className="flex transition-transform duration-500"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {videos &&
            videos.map((video) => (
              <div key={video.title} className="w-full flex-shrink-0">
                <RecipeCard video={video} />
              </div>
            ))}
        </div>
      </div>

      <button type="button" className="ml-4 absolute left-0" onClick={goToPrevious}>
        &#8249;
      </button>

      <button type="button" className="mr-4 absolute right-0" onClick={goToNext}>
        &#8250;
      </button>

      <div className="flex gap-2">
        {videos &&
          videos.map((video, index) => (
            <div
              key={video.title}
              className={`w-2 h-2 rounded-full ${index === currentIndex ? "bg-primary" : "bg-subContent"}`}
            ></div>
          ))}
      </div>
    </div>
  );
};

export default RecipeCarousel;
