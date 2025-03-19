import useModalStore from "@stores/modalStore";
import ProfileChangeModal from "./ProfileChangeModal";
import { useNavigate } from "react-router-dom";

const ProfileModal = () => {
  const { closeModal, openModal } = useModalStore();
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    closeModal();
    navigate(path);
  };

  return (
    <div className="flex flex-col py-10 justify-center items-center gap-6 font-preSemiBold text-lg">
      {/* 설정 페이지 이동 */}
      <button onClick={() => handleNavigate("/setting")}>설정</button>
      <hr className="w-[80%]" />
      {/* 프로필 전환 */}
      <button onClick={() => openModal(<ProfileChangeModal />)}>프로필 전환</button>
      <hr className="w-[80%]" />
      {/* 닫기 */}
      <button onClick={closeModal}>닫기</button>
    </div>
  );
};

export default ProfileModal;
