import { Link } from "react-router-dom";

interface HomeButtonProps {
  title: string;
  imgSrc?: string;
  link?: string;
  onAction?: () => void;
}

const HomeButtonElement = ({ title, imgSrc }: HomeButtonProps) => {
  return (
    <div className="flex w-full h-full p-2.5 flex-col justify-between items-center">
      <h2 className="w-full text-left text-sm font-semibold">{title}</h2>
      <div className="self-end">{imgSrc && <img src={imgSrc} alt={title} />}</div>
    </div>
  );
};

const HomeButton = ({ title, imgSrc, link, onAction }: HomeButtonProps) => {
  return link ? (
    <Link to={link} className="flex-1 bg-white aspect-[1/1] flex items-center justify-center">
      <HomeButtonElement title={title} imgSrc={imgSrc} />
    </Link>
  ) : (
    <button className="flex-1 bg-white aspect-[1/1] flex items-center justify-center" onClick={onAction}>
      <HomeButtonElement title={title} imgSrc={imgSrc} />
    </button>
  );
};

export default HomeButton;
