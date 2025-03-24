import { Ingredient } from "@/types/ingredientsTypes.ts";

import { formatDate } from "@utils/getFormattedDate";

const DetailIngredientInfo = ({ ingredient }: { ingredient: Ingredient }) => {
  const inComingDate = formatDate(new Date(ingredient.incomingDate));
  const expirationDate = formatDate(new Date(ingredient.expirationDate));

  return (
    <div className="absolute top-[5vh] left-1/2 -translate-x-1/2 flex justify-between items-center w-[80%] h-14 px-6 py-2 bg-white shadow-lg rounded-lg font-preRegular text-sm">
      <span className="flex justify-center items-center h-full aspect-[1/1] rounded-full bg-primary font-preBold text-white">
        <p>{ingredient.storagePlace === "냉장고" ? "냉장" : "냉동"}</p>
      </span>
      <div className="h-fit">
        <p>
          <strong className="text-primaryDark">입고</strong> : {inComingDate}
        </p>
        <p>
          <strong className="text-primaryDark">만료</strong> : {expirationDate}
        </p>
      </div>
    </div>
  );
};

export default DetailIngredientInfo;
