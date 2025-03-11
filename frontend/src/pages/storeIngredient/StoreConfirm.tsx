import ModalHeader from "@components/common/modal/ModalHeader";
import StoreConfirmMessage from "@pages/storeIngredient/components/StoreConfirmMessage";

const StoreConfirm = () => {
  return (
    <div>
      <ModalHeader title="재료 입고 완료" />
      <StoreConfirmMessage />
    </div>
  );
};

export default StoreConfirm;
