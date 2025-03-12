import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useModalStore from "@stores/modalStore";
import IconStarBlank from "@assets/icons/IconStarBlank";
import IconStarFill from "@assets/icons/IconStarFill";
import Button from "@components/common/button/Button";

const RecipeRatingForm = () => {
  const navigate = useNavigate();
  const { closeModal } = useModalStore();
  const [rating, setRating] = useState<boolean[]>([true, true, true, true, true]);

  const starRating = (index: number) => {
    const newRating = [...rating];

    newRating.forEach((_, idx) => {
      newRating[idx] = idx <= index ? true : false;
    });

    setRating(newRating);
  };

  const handleSaveRating = () => {
    //레시피 저장 API 호출

    closeModal();
    navigate("/");
  };

  return (
    <div className="py-6 flex flex-col items-center gap-10">
      <div className="flex gap-3 py-10">
        {rating.map((el, index) =>
          el ? (
            <button onClick={() => starRating(index)} key={index}>
              <IconStarFill key={index} width={45} height={45} />
            </button>
          ) : (
            <button onClick={() => starRating(index)} key={index}>
              <IconStarBlank width={45} height={45} />
            </button>
          )
        )}
      </div>
      <div className="flex gap-2">
        <Button type="button" design="cancel" content="취소하기" className="w-24 h-10" onAction={closeModal} />
        <Button type="button" design="confirm" content="저장하기" className="w-24 h-10" onAction={handleSaveRating} />
      </div>
    </div>
  );
};

export default RecipeRatingForm;
