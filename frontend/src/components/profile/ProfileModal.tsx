import useModalStore from "@stores/modalStore";

const ProfileModal = () => {
  const { closeModal } = useModalStore();
  return (
    <div className="flex flex-col py-10 justify-center items-center gap-6 font-preSemiBold text-lg">
      <button>설정</button>
      <hr className="w-[80%]" />
      <button>프로필 전환</button>
      <hr className="w-[80%]" />
      <button onClick={closeModal}>닫기</button>
    </div>
  );
};

export default ProfileModal;
