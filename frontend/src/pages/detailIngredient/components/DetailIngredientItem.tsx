import { Ingredient } from "@/types/ingredientsTypes.ts";

interface IngredientItemProps {
  ingredient: Ingredient;
  imgSrc: string;
}

const DetailIngredientItem = ({ ingredient, imgSrc }: IngredientItemProps) => {
  // 남은 만료일 계산
  const calculateDaysRemaining = () => {
    const today = new Date();
    const expirationDate = new Date(ingredient.expirationDate);

    const diffTime = expirationDate.getTime() - today.getTime();

    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  const daysRemaining = calculateDaysRemaining();

  return (
    <div className="flex flex-col w-1/5 h-fit p-1 justify-center items-center ">
      <div className="relative w-full aspect-[1/1] rounded-3xl">
        <img src={imgSrc} alt={imgSrc} className="w-full h-full object-cover rounded-3xl" />
        <span className="absolute right-0 top-0 bg-error px-1 py-0.5">D{daysRemaining}</span>
      </div>
    </div>
  );
};

export default DetailIngredientItem;
