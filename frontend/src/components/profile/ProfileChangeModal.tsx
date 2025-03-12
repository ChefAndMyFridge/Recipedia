import ProfileDad from "@assets/images/ProfileDad.png";
import ProfileMom from "@assets/images/ProfileMom.png";
import ProfileBoy from "@assets/images/ProfileBoy.png";
import ProfileGirl from "@assets/images/ProfileGirl.png";
import ModalHeader from "@components/common/modal/ModalHeader";
import useUserStore from "@stores/userStore";
import useModalStore from "@stores/modalStore";

interface ProfileInterface {
  image: string;
  alt: string;
  label: string;
}

const ProfileChangeModal = () => {
  const { setCurrentProfileImg, setUserName } = useUserStore();
  const { closeModal } = useModalStore();

  const profiles = [
    { image: ProfileDad, alt: "dad", label: "아빠" },
    { image: ProfileMom, alt: "mom", label: "엄마" },
    { image: ProfileBoy, alt: "boy", label: "아들" },
    { image: ProfileGirl, alt: "girl", label: "딸" },
  ];

  const handleProfileChange = (profile: ProfileInterface) => {
    setCurrentProfileImg(profile.image);
    setUserName(profile.label);
    closeModal();
  };

  return (
    <>
      <ModalHeader title="프로필 전환" />
      <div className="pb-10 flex flex-col items-center justify-center gap-4">
        <div className="grid grid-cols-2 gap-8">
          {profiles.map((profile) => (
            <button
              key={profile.alt}
              className="flex flex-col items-center justify-center gap-4"
              onClick={() => handleProfileChange(profile)}
            >
              <img src={profile.image} alt={profile.alt} className="w-32" />
              <p className="font-preSemiBold text-lg">{profile.label}</p>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProfileChangeModal;
