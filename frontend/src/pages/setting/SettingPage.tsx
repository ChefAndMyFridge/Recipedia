import Header from "@components/Layout/Header";
import SettingUserInfo from "@pages/setting/components/SettingUserInfo";
import SettingMenus from "@pages/setting/components/SettingMenus";

const SettingPage = () => {
  return (
    <section className="flex flex-col p-3 gap-5 items-center h-full">
      <Header title="프로필" isIcon />
      <SettingUserInfo />
      <SettingMenus />
    </section>
  );
};

export default SettingPage;
