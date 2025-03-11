import useIngredientsStore from "@stores/ingredientsStore.ts";
import useModalStore from "@stores/modalStore";

import ModalHeader from "@components/common/modal/ModalHeader";
import Button from "@components/common/button/Button";

import TakeoutIngredient from "@pages/takeoutIngredient/components/TakeoutIngredient";

const TakeoutIngredientModal = () => {
  const { selectedIngredients } = useIngredientsStore();
  const { closeModal } = useModalStore();

  if (Object.keys(selectedIngredients).length === 0) return;

  return (
    <div>
      <ModalHeader title="재료 출고" />

      {/* 선택한 재료 목록 확인 */}
      <div className="w-full h-fit px-2">
        <div className="flex h-[40vh] items-start content-start py-1 px-5 gap-y-5 shrink-0 flex-wrap font-preMedium bg-[#EEE] rounded-xl">
          {Object.values(selectedIngredients).map((ingredient) => (
            <TakeoutIngredient key={ingredient.ingredientInfoId} ingredient={ingredient} />
          ))}
        </div>
      </div>

      {/* 액션 */}
      <div className="flex justify-end align-center px-4 py-4 gap-2">
        <Button type="button" design="cancel" content="취소" className="w-24 h-10" onAction={closeModal} />
        <Button type="button" design="confirm" content="출고" className="w-24 h-10" />
      </div>
    </div>
  );
};

export default TakeoutIngredientModal;
