import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import useModalStore from "@stores/modalStore";
import useIngredientsStore from "@stores/ingredientsStore";

import Button from "@components/common/button/Button.tsx";

const TakeoutConfirmMessage = () => {
  const navigate = useNavigate();
  const { closeModal } = useModalStore();
  const { setClearSelectedIngredients } = useIngredientsStore();

  useEffect(() => {
    setTimeout(() => {
      handleCloseModal();
    }, 5000);
  }, []);

  function handleCloseModal(): void {
    setClearSelectedIngredients();
    closeModal();
  }

  function handleRecipeRecommendation(): void {
    navigate("/recipeList/ingredient");
    closeModal();
  }

  return (
    <div className="px-4 pb-4">
      <div className="flex flex-col w-full items-center px-4 py-10 font-preMedium">
        <p className="m-0">재료 출고가 완료되었습니다.</p>
        <p className="m-0">5초 뒤 자동으로 홈으로 이동합니다.</p>
      </div>
      <div className="flex flex-col w-full justify-between items-center font-preRegular gap-2">
        <Button
          type="button"
          design="cancel"
          onAction={handleCloseModal}
          content="홈으로 돌아가기"
          className="w-full h-10"
        />
        <Button
          type="button"
          design="confirm"
          onAction={handleRecipeRecommendation}
          content="출고 재료로 레시피 추천 받기"
          className="w-full h-10"
        />
      </div>
    </div>
  );
};

export default TakeoutConfirmMessage;
