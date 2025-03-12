import IconHistory from "@assets/icons/IconHistory";
import IconPreference from "@assets/icons/IconPreference";
import IconHeart from "@assets/icons/IconHeart";

const SettingMenus = () => {
  const bannerClass = "flex flex-col items-start";
  const titleClass = "text-lg font-preSemiBold";
  const descriptionClass = "text-sm font-preRegular break-keep";

  return (
    <div className="w-full h-[60%] flex flex-col items-center justify-center gap-8">
      <div className="w-[90%] h-24 bg-white rounded-lg shadow-md flex items-center px-4 gap-4">
        <IconHeart width={30} height={30} />
        <div className={bannerClass}>
          <p className={titleClass}>즐겨찾는 레시피</p>
          <p className={descriptionClass}>찜해놓은 레시피를 모아볼 수 있어요.</p>
        </div>
      </div>
      <div className="w-[90%] h-24 bg-white rounded-lg shadow-md flex items-center px-4 gap-4">
        <IconHistory width={30} height={30} />
        <div className={bannerClass}>
          <p className={titleClass}>이전 레시피</p>
          <p className={descriptionClass}>과거에 요리했던 레시피를 모아볼 수 있어요.</p>
        </div>
      </div>
      <div className="w-[90%] h-24 bg-white rounded-lg shadow-md flex items-center  px-4 gap-4">
        <IconPreference width={30} height={30} />
        <div className={bannerClass}>
          <p className={titleClass}>개인 선호</p>
          <p className={descriptionClass}>재료 선호도 등을 설정할 수 있어요.</p>
        </div>
      </div>
    </div>
  );
};

export default SettingMenus;
