import useIngredientsStore from "@stores/ingredientsStore";
import useModalStore from "@stores/modalStore";

import Button from "@components/common/button/Button.tsx";

import TakeoutIngredientModal from "@pages/takeoutIngredient/TakeoutIngredientModal";

const HomeSelectedIngredients = () => {
  const { selectedIngredients } = useIngredientsStore();
  const { openModal } = useModalStore();

  return (
    <div className="flex justify-between items-center w-full h-full px-2 bg-white rounded-xl">
      <div className="flex items-center justify-start w-4/5 h-full gap-2">
        {Object.values(selectedIngredients).map((ingredient) => (
          <div key={ingredient.ingredientInfoId} className="w-12 aspect-[1/1]">
            <div className="relative aspect-[1/1] rounded-3xl">
              <img
                src={ingredient.imageUrl}
                alt={ingredient.imageUrl}
                className="w-full h-full object-cover rounded-3xl"
              />
              <span className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent rounded-b-3xl" />
              <p
                className="absolute bottom-0.5 w-full font-preMedium text-xs text-center text-white"
                style={{
                  textShadow: "0.5px 0 black, 0 0.5px black, -0.5px 0 black, 0 -0.5px black",
                }}
              >
                {ingredient.name}
              </p>
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
