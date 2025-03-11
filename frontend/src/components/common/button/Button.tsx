import { ButtonProps } from "@/types/commonProps.ts";

const Button = ({ type, design, content, width, height, onAction, className }: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onAction}
      className={`font-preMedium text-sm rounded-full ${width ? `w-${width}` : "w-full"} ${height ? `h-${height}` : "min-h-10"} ${design === "confirm" ? "bg-primary text-white hover:bg-primaryDark" : "bg-subContent text-white hover:bg-content2"} ${className}`}
    >
      {content}
    </button>
  );
};

export default Button;
