import { useNavigate } from "react-router-dom";
import ArrowLeft from "@assets/icons/ArrowLeft";
import useRecipeStore from "@/stores/recipeStore";

interface HeaderProps {
  title: string;
  isIcon?: boolean;
  className?: string;
}

const Header = ({ title, isIcon, className }: HeaderProps) => {
  const navigate = useNavigate();

  const { setRecipeSelectedIngredients } = useRecipeStore();

  return (
    <header className={`${className} w-full flex items-center justify-left gap-[10px] p-1 font-preSemiBold`}>
      {isIcon && (
        <button type="button" onClick={() => navigate(-1)}>
          <ArrowLeft width={30} height={30} strokeColor="#3C3C3C" onClick={() => setRecipeSelectedIngredients([])} />
        </button>
      )}
      <p className="text-lg">{title}</p>
    </header>
  );
};

export default Header;
