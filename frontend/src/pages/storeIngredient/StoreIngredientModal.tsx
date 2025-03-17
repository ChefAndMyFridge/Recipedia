import ModalHeader from "@components/common/modal/ModalHeader";
import StoreIngredientForm from "@pages/storeIngredient/components/StoreIngredientForm";
import LoadingPlayer from "@components/common/loading/LoadingPlayer";

const StoreIngredientModal = () => {
  return (
    <div>
      <ModalHeader title="재료 입고" />
      <StoreIngredientForm />
      <LoadingPlayer />
    </div>
  );
};

export default StoreIngredientModal;
