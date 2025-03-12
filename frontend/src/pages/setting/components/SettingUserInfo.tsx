import useUserStore from "@stores/userStore";

const SettingUserInfo = () => {
  const { currentProfileImg, username } = useUserStore();
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <img src={currentProfileImg} alt="profile" className="w-40 h-40 rounded-full" />
      <p className="text-2xl font-preSemiBold">{username}</p>
    </div>
  );
};

export default SettingUserInfo;
