import useModalStore from "@stores/modalStore.ts";

import Button from "@components/common/button/Button.tsx";

import StoreIngredientModal from "@pages/storeIngredient/StoreIngredientModal";

import ProfileModal from "@components/profile/ProfileModal";
import useUserStore from "@stores/userStore";

const HomeHeaderButtons = () => {
  const { openModal } = useModalStore();
  const { currentProfileImg } = useUserStore();

  return (
    <div className="flex h-fit justify-between items-center gap-2">
      <button
        className="flex flex-1 w-10 aspect-[1/1] bg-white rounded-full items-center justify-center"
        onClick={() => openModal(<ProfileModal />)}
      >
        <img src={`${currentProfileImg}`} alt="profile" />
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
