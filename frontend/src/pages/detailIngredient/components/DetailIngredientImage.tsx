import { useState } from "react";

import IconCloseCircle from "@assets/icons/IconCloseCircle";
import IconInfomation from "@assets/icons/IconInfomation";

const DetailIngredientImage = ({ imgSrc }: { imgSrc: string }) => {
  const [detailInfo, setDetailInfo] = useState<boolean>(false);

  function handleDetailInfo() {
    setDetailInfo(!detailInfo);
  }

  return (
    <div className="relative h-[30vh] w-full overflow-hidden">
      <img src={imgSrc} alt={imgSrc} className="w-full h-full object-cover object-center" />

      {/* 영양 정보 표시 */}
      {detailInfo && (
        <div className="absolute top-0 left-0 flex justify-center items-center w-full h-full bg-black bg-opacity-50 text-white font-preRegular">
          <p>영양 정보</p>
        </div>
      )}

      {/* 영양 정보 - 사진 전환 버튼 */}
      {detailInfo ? (
        <button
          className="absolute bottom-3 right-3 flex justify-between items-center py-1 pl-2 pr-3  h-10 gap-2 rounded-3xl bg-white bg-opacity-75 font-preRegular text-sm"
          onClick={handleDetailInfo}
        >
          <IconCloseCircle strokeColor="black" width={25} height={25} />
          <p>닫기</p>
        </button>
      ) : (
        <button
          className="absolute bottom-3 right-3 flex justify-between items-center py-1 pl-2 pr-3 h-10 gap-2 rounded-3xl bg-white bg-opacity-75 font-preRegular text-sm"
          onClick={handleDetailInfo}
        >
          <IconInfomation strokeColor="black" width={25} height={25} />
          <p>영양 정보</p>
        </button>
      )}
    </div>
  );
};

export default DetailIngredientImage;
