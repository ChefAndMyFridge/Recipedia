import ModalHeader from "@components/common/modal/ModalHeader";
import StoreIngredientForm from "@pages/storeIngredient/components/StoreIngredientForm";

const StoreIngredientModal = () => {
  return (
    <div>
      <ModalHeader title="재료 입고" />
      <StoreIngredientForm />
    </div>
  );
};

export default StoreIngredientModal;
