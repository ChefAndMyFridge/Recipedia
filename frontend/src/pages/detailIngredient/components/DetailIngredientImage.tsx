import { useState, useEffect } from "react";
import { useGetIngredientNutrition } from "@hooks/useIngredientsHooks";

import { Nutritions } from "@/types/ingredientsTypes";
import { NUTRITIONS } from "@/data/NUTRITIONS";

import IconCloseCircle from "@assets/icons/IconCloseCircle";
import IconInfomation from "@assets/icons/IconInfomation";

const NutritionsInfo = ({ detailInfo }: { detailInfo: Nutritions }) => {
  return (
    <div className="grid grid-cols-2 max-w-4/5 max-h-4/5 gap-5 text-center text-xs font-preLight">
      <table className="w-full h-full text-left">
        <tbody>
          <tr className="border-b border-gray-300">
            <th className="p-1">칼로리</th>
            <td className="p-1">{detailInfo.calories} kcal</td>
          </tr>
          <tr className="border-b border-gray-300">
            <th className="p-1">탄수화물</th>
            <td className="p-1">{detailInfo.carbohydrate} g</td>
          </tr>
          <tr className="border-b border-gray-300">
            <th className="p-1">단백질</th>
            <td className="p-1">{detailInfo.protein} g</td>
          </tr>
          <tr className="border-b border-gray-300">
            <th className="p-1">지방</th>
            <td className="p-1">{detailInfo.fat} g</td>
          </tr>
          <tr className="border-b border-gray-300">
            <th className="p-1">나트륨</th>
            <td className="p-1">{detailInfo.sodium} mg</td>
          </tr>
          <tr>
            <th className="p-1">당류</th>
            <td className="p-1">{detailInfo.sugars} g</td>
          </tr>
        </tbody>
      </table>
      <table className="w-full h-5/6 text-left">
        <tbody>
          <tr className="border-b border-gray-300">
            <th className="p-1">콜레스테롤</th>
            <td className="p-1">{detailInfo.cholesterol} mg</td>
          </tr>
          <tr className="border-b border-gray-300">
            <th className="p-1">포화지방</th>
            <td className="p-1">{detailInfo.saturatedFat} g</td>
          </tr>
          <tr className="border-b border-gray-300">
            <th className="p-1">불포화지방</th>
            <td className="p-1">{detailInfo.unsaturatedFat} g</td>
          </tr>
          <tr className="border-b border-gray-300">
            <th className="p-1">트랜스지방</th>
            <td className="p-1">{detailInfo.transFat} g</td>
          </tr>
          <tr>
            <th className="p-1">알레르기 정보</th>
            <td className="p-1">{detailInfo.allergenInfo}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const DetailIngredientImage = ({ imgSrc, ingredientId }: { imgSrc: string; ingredientId: number }) => {
  const [isOpenDetailInfo, setIsOpenDetailInfo] = useState<boolean>(false);
  const [detailInfo, setDetailInfo] = useState<Nutritions>(NUTRITIONS); // 일단 빈 값 할당

  const { data } = useGetIngredientNutrition(ingredientId);

  useEffect(() => {
    if (data) {
      setDetailInfo(data.nutrients as Nutritions);
    }
  }, [data]);

  function handleDetailInfo() {
    setIsOpenDetailInfo(!isOpenDetailInfo);
  }

  return (
    <div className="relative h-[30vh] w-full overflow-hidden">
      <img src={imgSrc} alt={imgSrc} className="w-full h-full object-cover object-center" />

      {/* 영양 정보 표시 */}
      {detailInfo && isOpenDetailInfo && (
        <div className="absolute top-0 left-0 flex justify-center items-center w-full h-full bg-black bg-opacity-50 text-white font-preRegular">
          <NutritionsInfo detailInfo={detailInfo} />
        </div>
      )}
      {!detailInfo && isOpenDetailInfo && (
        <div className="absolute top-0 left-0 flex justify-center items-center w-full h-full bg-black bg-opacity-50 text-white font-preRegular">
          <p>영양 정보가 없습니다.</p>
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
