import ArrowLeft from "@assets/icons/ArrowLeft";

interface HeaderProps {
  title: string;
  isIcon?: boolean;
  className?: string;
}

const Header = ({ title, isIcon, className }: HeaderProps) => {
  return (
    <header className={`${className} w-full flex items-center justify-left gap-[10px] p-1 font-preSemiBold`}>
      {isIcon && <ArrowLeft width={30} height={30} strokeColor="#3C3C3C" />}
      <p className="text-lg">{title}</p>
    </header>
  );
};

export default Header;
