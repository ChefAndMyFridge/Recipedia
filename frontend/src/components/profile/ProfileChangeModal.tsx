import useUserStore from "@stores/userStore";
import useModalStore from "@stores/modalStore";

import { useGetMemberList } from "@hooks/useUserHook";

import ModalHeader from "@components/common/modal/ModalHeader";
import ProfileAddModal from "@components/profile/ProfileAddModal";

import IconIncrease from "@assets/icons/IconIncrease";

import { User } from "@/types/userTypes";
import defaultProfile from "@assets/images/DefaultProfile.png";

const ProfileChangeModal = () => {
  const { setCurrentProfileImg, setUserName, setUserId } = useUserStore();
  const { openModal, closeModal } = useModalStore();

  // 등록된 가족 구성원 리스트 조회
  const { data: profiles } = useGetMemberList();

  const handleProfileChange = (profile: User) => {
    setUserId(profile.memberId);
    setCurrentProfileImg(defaultProfile);
    setUserName(profile.membername);
    closeModal();
  };

  return (
    <>
      <ModalHeader title="프로필 전환" />
      <div className="pb-10 flex flex-col items-center justify-center gap-4">
        <div className="grid grid-cols-2 gap-x-14 gap-y-6">
          {profiles &&
            profiles.map((profile) => (
              <button
                key={profile.memberId}
                className="flex flex-col items-center justify-center gap-4 rounded-full"
                onClick={() => handleProfileChange(profile)}
              >
                <img
                  src={defaultProfile} // 이미지 서버가 추가된다면 변경 필요
                  alt={profile.membername}
                  onError={(event) => (event.currentTarget.src = defaultProfile)} // 이미지 로드 실패 시 대체 이미지
                  className="w-28 aspect-[1/1] rounded-full object-cover"
                />
                <p className="font-preSemiBold text-lg">{profile.membername}</p>
              </button>
            ))}

          {/* 사용자 추가 */}
          {profiles && profiles.length < 6 && (
            <button
              className="flex flex-col items-center justify-center gap-4"
              onClick={() => openModal(<ProfileAddModal />)}
            >
              <div className="w-28 h-28 flex items-center justify-center bg-gray-200 rounded-full">
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
