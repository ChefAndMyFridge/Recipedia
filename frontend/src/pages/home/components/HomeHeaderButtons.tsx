import useModalStore from "@stores/modalStore.ts";

import Button from "@components/common/button/Button.tsx";

import StoreIngredient from "@pages/storeIngredient/StoreIngredient";

const HomeHeaderButtons = () => {
  const { openModal } = useModalStore();

  return (
    <div className="flex h-fit justify-between items-center gap-2">
      <button className="flex flex-1 p-2 w-10 h-10 bg-white rounded-full items-center justify-center">P</button>
      <Button
        type="button"
        design="confirm"
        content="입고"
        width="10"
        height="10"
        onAction={() => openModal(<StoreIngredient />)}
      />
    </div>
  );
};

export default HomeHeaderButtons;
