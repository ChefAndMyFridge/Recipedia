import { useState, useEffect } from "react";
import { useGetIngredientNutrition } from "@hooks/useIngredientsHooks";

import { Nutritions } from "@/types/ingredientsTypes";
import { NUTRITIONS } from "@/data/NUTRITIONS";

import IconCloseCircle from "@assets/icons/IconCloseCircle";
import IconInfomation from "@assets/icons/IconInfomation";

const DetailIngredientImage = ({ imgSrc, ingredientId }: { imgSrc: string; ingredientId: number }) => {
  const [isOpenDetailInfo, setIsOpenDetailInfo] = useState<boolean>(false);
  const [detailInfo, setDetailInfo] = useState<Nutritions>(NUTRITIONS); // 일단 빈 값 할당

  const { data } = useGetIngredientNutrition(ingredientId);

  useEffect(() => {
    if (data) {
      setDetailInfo(data.nutrients);
    }
  }, [data]);

  function handleDetailInfo() {
    setIsOpenDetailInfo(!isOpenDetailInfo);
  }

  return (
    <div className="relative h-[30vh] w-full overflow-hidden">
      <img src={imgSrc} alt={imgSrc} className="w-full h-full object-cover object-center" />

      {/* 영양 정보 표시 */}
      {isOpenDetailInfo && (
        <div className="absolute top-0 left-0 flex justify-center items-center w-full h-full bg-black bg-opacity-50 text-white font-preRegular">
          <div className="grid grid-cols-2 gap-4 text-center text-sm">
            <div>
              <p>칼로리: {detailInfo.calories}kcal</p>
              <p>탄수화물: {detailInfo.carbohydrate}g</p>
              <p>단백질: {detailInfo.protein}g</p>
              <p>지방: {detailInfo.fat}g</p>
              <p>나트륨: {detailInfo.sodium}mg</p>
              <p>당류: {detailInfo.sugars}g</p>
            </div>
            <div>
              <p>콜레스테롤: {detailInfo.cholesterol}mg</p>
              <p>포화지방: {detailInfo.saturatedFat}g</p>
              <p>불포화지방: {detailInfo.unsaturatedFat}g</p>
              <p>트랜스지방: {detailInfo.transFat}g</p>
              <p>알레르기 정보: {detailInfo.allergenInfo}</p>
            </div>
          </div>
        </div>
      )}

      {/* 영양 정보 - 사진 전환 버튼 */}
      {isOpenDetailInfo ? (
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
