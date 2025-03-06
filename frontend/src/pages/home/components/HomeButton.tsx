import { Link } from "react-router-dom";

interface HomeButtonProps {
  title: string;
  imgSrc?: string;
  link?: string;
  onAction?: () => void;
}

const HomeButton = ({ title, imgSrc, link, onAction }: HomeButtonProps) => {
  return link ? (
    <Link to={link} className="flex-1 p-5 bg-white aspect-[1/1] flex items-center justify-center">
      <button>{title}</button>
    </Link>
  ) : (
    <button className="flex-1 p-5 bg-white aspect-[1/1] flex items-center justify-center" onClick={onAction}>
      {title}
    </button>
  );
};

export default HomeButton;
