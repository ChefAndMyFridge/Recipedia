import { RecipeText } from "@/types/recipeListTypes";

interface RecipeTextsProps {
  recipe: RecipeText;
}

const RecipeTexts = ({ recipe }: RecipeTextsProps) => {
  return (
    <section className="flex flex-col items-center gap-6 w-full portrait:max-h-[40%] landscape:max-h-[90%] px-3 py-4 bg-white rounded-xl shadow-md overflow-y-auto">
      {Object.entries(recipe).map(([step, instructions], index) => (
        <div key={step} className="w-full flex flex-col justify-start items-start gap-2">
          <h3 className="text-base font-preBold">
            {index + 1}. {step}
          </h3>
          <ul className="flex flex-col">
            {instructions.map((instruction, i) => (
              <li key={i} className="text-sm font-preMedium break-keep">
                {instruction}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
};

export default RecipeTexts;
