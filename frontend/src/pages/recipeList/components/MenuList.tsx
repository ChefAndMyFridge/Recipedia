import { VideoList } from "@/types/recipeListTypes";

interface MenuListProps {
  dishes: string[];
  selectedDish: keyof VideoList;
  setSelectedDish: (dish: keyof VideoList) => void;
}

const MenuList = ({ dishes, selectedDish, setSelectedDish }: MenuListProps) => {
  return (
    <div className="w-full">
      <div className="relative">
        <div className="px-5 py-3 flex gap-4 text-sm overflow-x-auto whitespace-nowrap scrollbar-hide">
          {dishes.map((dish) => (
            <div
              key={dish}
              onClick={() => setSelectedDish(dish as keyof VideoList)}
              className={` flex justify-center ${
                selectedDish === dish ? "text-black font-preBold" : "text-content2 font-preMedium"
              }`}
            >
              {dish}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuList;
