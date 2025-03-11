import { ButtonProps } from "@/types/commonProps.ts";

const Button = ({ type, design, content, width, height, onAction, className }: ButtonProps) => {
  const getWidthClass = () => {
    if (!width) return "w-full";
    switch (width) {
      case "1":
        return "w-1";
      case "2":
        return "w-2";
      case "3":
        return "w-3";
      case "4":
        return "w-4";
      case "5":
        return "w-5";
      case "6":
        return "w-6";
      case "7":
        return "w-7";
      case "8":
        return "w-8";
      case "9":
        return "w-9";
      case "10":
        return "w-10";
      case "11":
        return "w-11";
      case "12":
        return "w-12";
      case "14":
        return "w-14";
      case "16":
        return "w-16";
      case "20":
        return "w-20";
      case "24":
        return "w-24";
      case "28":
        return "w-28";
      case "32":
        return "w-32";
      case "36":
        return "w-36";
      case "40":
        return "w-40";
      case "44":
        return "w-44";
      case "48":
        return "w-48";
      case "52":
        return "w-52";
      case "56":
        return "w-56";
      case "60":
        return "w-60";
      case "64":
        return "w-64";
      case "72":
        return "w-72";
      case "80":
        return "w-80";
      case "96":
        return "w-96";
      case "auto":
        return "w-auto";
      case "1/2":
        return "w-1/2";
      case "1/3":
        return "w-1/3";
      case "2/3":
        return "w-2/3";
      case "1/4":
        return "w-1/4";
      case "3/4":
        return "w-3/4";
      default:
        return "w-full";
    }
  };

  const getHeightClass = () => {
    if (!height) return "min-h-10";
    switch (height) {
      case "1":
        return "h-1";
      case "2":
        return "h-2";
      case "3":
        return "h-3";
      case "4":
        return "h-4";
      case "5":
        return "h-5";
      case "6":
        return "h-6";
      case "7":
        return "h-7";
      case "8":
        return "h-8";
      case "9":
        return "h-9";
      case "10":
        return "h-10";
      case "11":
        return "h-11";
      case "12":
        return "h-12";
      case "14":
        return "h-14";
      case "16":
        return "h-16";
      case "20":
        return "h-20";
      case "24":
        return "h-24";
      case "28":
        return "h-28";
      case "32":
        return "h-32";
      case "36":
        return "h-36";
      case "40":
        return "h-40";
      case "44":
        return "h-44";
      case "48":
        return "h-48";
      case "52":
        return "h-52";
      case "56":
        return "h-56";
      case "60":
        return "h-60";
      case "64":
        return "h-64";
      case "auto":
        return "h-auto";
      default:
        return "min-h-10";
    }
  };

  return (
    <button
      type={type}
      onClick={onAction}
      className={`font-preMedium text-sm rounded-full ${getWidthClass()} ${getHeightClass()} ${design === "confirm" ? "bg-primary text-white hover:bg-primaryDark" : "bg-subContent text-white hover:bg-content2"} ${className}`}
    >
      {content}
    </button>
  );
};

export default Button;
