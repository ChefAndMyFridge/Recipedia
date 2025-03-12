import useModalStore from "@stores/modalStore.ts";

import Button from "@components/common/button/Button.tsx";

import StoreIngredientModal from "@pages/storeIngredient/StoreIngredientModal";

import ProfileDad from "@assets/images/ProfileDad.png";
import ProfileModal from "@components/profile/ProfileModal";

const HomeHeaderButtons = () => {
  const { openModal } = useModalStore();

  return (
    <div className="flex h-fit justify-between items-center gap-2">
      <button
        className="flex flex-1 w-10 aspect-[1/1] bg-white rounded-full items-center justify-center"
        onClick={() => openModal(<ProfileModal />)}
      >
        <img src={ProfileDad} alt="profile" />
      </button>

      <Button
        type="button"
        design="confirm"
        content="입고"
        className="w-10 aspect-[1/1]"
        onAction={() => openModal(<StoreIngredientModal />)}
      />
    </div>
  );
};

export default HomeHeaderButtons;
