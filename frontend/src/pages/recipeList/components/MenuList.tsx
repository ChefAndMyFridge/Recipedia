import { useState } from "react";

interface MenuListProps {
  dishes: string[];
}

const MenuList = ({ dishes }: MenuListProps) => {
  const [selectedDish, setSelectedDish] = useState<string>(dishes[0]);
  return (
    <div className="w-full">
      <div className="relative">
        <div className="px-5 py-3 flex gap-4 text-sm overflow-x-auto whitespace-nowrap scrollbar-hide">
          {dishes.map((dish) => (
            <div
              key={dish}
              onClick={() => setSelectedDish(dish)}
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
