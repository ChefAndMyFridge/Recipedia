import { Ingredient } from "@/types/ingredientsTypes.ts";

import { formatDate } from "@utils/getFormattedDate";

const DetailIngredientInfo = ({ ingredient }: { ingredient: Ingredient }) => {
  const inComingDate = formatDate(new Date(ingredient.incomingDate));
  const expirationDate = formatDate(new Date(ingredient.expirationDate));

  return (
    <div className="flex justify-between items-center w-[90%] h-14 px-4 py-2 z-10 bg-white shadow-lg rounded-lg font-preRegular text-sm">
      <div className="h-fit">
        <p>
          <strong className="text-primaryDark">입고</strong> : {inComingDate}
        </p>
        <p>
          <strong className="text-primaryDark">만료</strong> : {expirationDate}
        </p>
      </div>

      <span className="flex justify-center items-center h-full aspect-[1/1] rounded-full bg-primary font-preBold text-white">
        <p>{ingredient.storagePlace === "fridge" ? "냉장" : "냉동"}</p>
      </span>
    </div>
  );
};

export default DetailIngredientInfo;
