import { useNavigate } from "react-router-dom";

import IconHistory from "@assets/icons/IconHistory";
import IconHeart from "@assets/icons/IconHeart";
import IconUserRemove from "@assets/icons/IconUserRemove";

const SettingMenus = () => {
  const navigate = useNavigate();

  const BANNER_CLASS = "flex flex-col items-start";
  const TITLE_CLASS = "text-lg font-preSemiBold";
  const DESCRIPTION_CLASS = "text-sm font-preRegular break-keep";
  const BUTTON_CLASS = "w-[90%] h-24 bg-white rounded-lg shadow-md flex items-center px-4 gap-4";

  return (
    <div className="w-full h-[60%] flex flex-col items-center justify-center gap-8">
      <button className={BUTTON_CLASS} onClick={() => navigate("/setting/favorite")}>
        <IconHeart width={30} height={30} />
        <div className={BANNER_CLASS}>
          <p className={TITLE_CLASS}>즐겨찾는 레시피</p>
          <p className={DESCRIPTION_CLASS}>찜해놓은 레시피를 모아볼 수 있어요.</p>
        </div>
      </button>
      <button className={BUTTON_CLASS} onClick={() => navigate("/setting/history")}>
        <IconHistory width={30} height={30} />
        <div className={BANNER_CLASS}>
          <p className={TITLE_CLASS}>이전 레시피</p>
          <p className={DESCRIPTION_CLASS}>과거에 요리했던 레시피를 모아볼 수 있어요.</p>
        </div>
      </button>
      <button className={BUTTON_CLASS} onClick={() => navigate("/setting/history")}>
        <IconUserRemove width={30} height={30} />
        <div className={BANNER_CLASS}>
          <p className={TITLE_CLASS}>유저 프로필 삭제</p>
          <p className={DESCRIPTION_CLASS}>프로필 정보를 삭제할 수 있어요.</p>
        </div>
      </button>
    </div>
  );
};

export default SettingMenus;
