import useIngredientsStore from "@stores/ingredientsStore";
import useModalStore from "@stores/modalStore";

import Button from "@components/common/button/Button.tsx";

import TakeoutIngredientModal from "@pages/takeoutIngredient/TakeoutIngredientModal";

import noImg from "@assets/images/noIngredient/carrot.png";

const HomeSelectedIngredients = () => {
  const { selectedIngredients } = useIngredientsStore();
  const { openModal } = useModalStore();

  return (
    <div className="flex justify-between items-center w-full h-full px-2 bg-white rounded-xl">
      <div className="grid grid-flow-col auto-cols-max w-4/5 h-fit gap-2 overflow-x-auto">
        {selectedIngredients &&
          Object.values(selectedIngredients).map((ingredient) => (
            <div key={ingredient.ingredientInfoId} className="w-12 aspect-[1/1]">
              <div className="relative w-full aspect-[1/1] rounded-3xl">
                <img
                  src={ingredient.imageUrl ? ingredient.imageUrl : noImg}
                  alt={ingredient.imageUrl}
                  className="w-full h-full object-cover rounded-3xl"
                />
                <span className="absolute flex justify-center items-center right-0 top-0 bg-orange-500 w-5 h-5 rounded-3xl">
                  <p className="font-preRegular text-white text-xs ">{ingredient.selectedCount}</p>
                </span>
              </div>
            </div>
          ))}
      </div>

      <div className="flex justify-center items-center w-1/5 h-full">
        <Button
          type="button"
          design="confirm"
          content="출고"
          className="w-12 aspect-[1/1]"
          onAction={() => openModal(<TakeoutIngredientModal />)}
        />
      </div>
    </div>
  );
};

export default HomeSelectedIngredients;
