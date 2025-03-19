import { DeleteIngredientResponse } from "@/types/ingredientsTypes";

import ModalHeader from "@components/common/modal/ModalHeader";

import TakeoutConfirmMessage from "@pages/takeoutIngredient/components/TakeoutConfirmMessage";

const TakeoutConfirmModal = ({ deleteIngredients }: { deleteIngredients: DeleteIngredientResponse }) => {
  return (
    <div>
      <ModalHeader title="재료 출고" />
      <TakeoutConfirmMessage deleteIngredients={deleteIngredients} />
    </div>
  );
};

export default TakeoutConfirmModal;
