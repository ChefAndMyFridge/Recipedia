import useUserStore from "@stores/userStore";
import useModalStore from "@stores/modalStore";

import { useGetMemberList } from "@hooks/useUserHook";

import ModalHeader from "@components/common/modal/ModalHeader";
import ProfileAddModal from "@components/profile/ProfileAddModal";

import IconIncrease from "@assets/icons/IconIncrease";

// import { USERS } from "@/data/USERS";
import { User } from "@/types/userTypes";
import ProfileGirl from "@assets/images/ProfileGirl.png";

const ProfileChangeModal = () => {
  const { setCurrentProfileImg, setUserName, setUserId } = useUserStore();
  const { openModal, closeModal } = useModalStore();

  // 등록된 가족 구성원 리스트 조회
  const { data: profiles } = useGetMemberList();

  const handleProfileChange = (profile: User) => {
    setUserId(profile.memberId);
    setCurrentProfileImg(ProfileGirl);
    setUserName(profile.membername);
    closeModal();
  };

  return (
    <>
      <ModalHeader title="프로필 전환" />
      <div className="pb-10 flex flex-col items-center justify-center gap-4">
        <div className="grid grid-cols-2 gap-8">
          {profiles &&
            profiles.map((profile) => (
              <button
                key={profile.memberId}
                className="flex flex-col items-center justify-center gap-4"
                onClick={() => handleProfileChange(profile)}
              >
                <img src={ProfileGirl} alt={profile.membername} className="w-32" />
                <p className="font-preSemiBold text-lg">{profile.membername}</p>
              </button>
            ))}

          {/* 사용자 추가 */}
          {profiles && profiles.length < 6 && (
            <button
              className="flex flex-col items-center justify-center gap-4"
              onClick={() => openModal(<ProfileAddModal />)}
            >
              <div className="w-32 h-32 flex items-center justify-center bg-gray-200 rounded-full">
                <IconIncrease width={30} height={30} strokeColor="white" />
              </div>
              <p className="font-preSemiBold text-lg">구성원 추가</p>
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfileChangeModal;
