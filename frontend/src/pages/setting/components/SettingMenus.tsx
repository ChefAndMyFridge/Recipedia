import IconHistory from "@assets/icons/IconHistory";
import IconPreference from "@assets/icons/IconPreference";
import IconHeart from "@assets/icons/IconHeart";

const SettingMenus = () => {
  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div className="w-[80%] h-20 bg-white rounded-lg shadow-md flex items-center px-4 gap-4">
        <IconHeart width={30} height={30} />
        <div className="flex flex-col">
          <p className="text-lg font-preSemiBold">즐겨찾는 레시피</p>
          <p className="text-sm font-preRegular">찜해놓은 레시피를 모아볼 수 있어요.</p>
        </div>
      </div>
      <div className="w-[80%] h-20 bg-white rounded-lg shadow-md flex items-center px-4 gap-4">
        <IconHistory width={30} height={30} />
        <div className="flex flex-col">
          <p className="text-lg font-preSemiBold">이전 레시피</p>
          <p className="text-sm font-preRegular">과거에 요리했던 레시피를 모아볼 수 있어요.</p>
        </div>
      </div>
      <div className="w-[80%] h-20 bg-white rounded-lg shadow-md flex items-center px-4 gap-4">
        <IconPreference width={30} height={30} />
        <div className="flex flex-col">
          <p className="text-lg font-preSemiBold">개인 선호</p>
          <p className="text-sm font-preRegular">재료 선호도 등을 설정할 수 있어요.</p>
        </div>
      </div>
    </div>
  );
};

export default SettingMenus;
