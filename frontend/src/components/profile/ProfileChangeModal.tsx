import ModalHeader from "@components/common/modal/ModalHeader";

import useUserStore from "@stores/userStore";
import useModalStore from "@stores/modalStore";

import { useGetMemberList } from "@hooks/useUserHook";

// import { USERS } from "@/data/USERS";
import { User } from "@/types/userTypes";
import ProfileGirl from "@assets/images/ProfileGirl.png";

const ProfileChangeModal = () => {
  const { setCurrentProfileImg, setUserName, setUserId } = useUserStore();
  const { closeModal } = useModalStore();

  //목데이터, 추후 API 연동 필요
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
        </div>
      </div>
    </>
  );
};

export default ProfileChangeModal;
