import useIngredientsStore from "@stores/ingredientsStore";
import useModalStore from "@stores/modalStore";

import Button from "@components/common/button/Button.tsx";

import TakeoutIngredientModal from "@pages/takeoutIngredient/TakeoutIngredientModal";

const HomeSelectedIngredients = () => {
  const { selectedIngredients } = useIngredientsStore();
  const { openModal } = useModalStore();

  return (
    <div className="flex justify-between items-center w-full h-full p-2 bg-white rounded-xl">
      <div className="flex items-center justify-start w-4/5 h-full gap-2">
        {Object.values(selectedIngredients).map((ingredient) => (
          <div key={ingredient.ingredientInfoId} className="w-12 aspect-[1/1]">
            <div className="relative bg-content2 aspect-[1/1] rounded-3xl">
              {/* <img src={ingredient.imageUrl} /> */}
              <p className="absolute bottom-0.5 w-full font-preMedium text-xs text-center">{ingredient.name}</p>
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
