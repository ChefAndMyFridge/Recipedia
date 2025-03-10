interface ButtonProps {
  type: "confirm" | "cancel";
  content: string;
  width?: string;
  height?: string;
  onAction?: () => void;
}

const Button = ({ type, content, width, height, onAction }: ButtonProps) => {
  return (
    <button
      type="button"
      onClick={onAction}
      className={`font-preMedium text-sm rounded-full min-h-10 ${width ? `w-${width}` : "w-full"} ${height ? `h-${height}` : ""} ${type === "confirm" ? "bg-primary text-white hover:bg-primaryDark" : "bg-subContent text-white hover:bg-content2"}`}
    >
      {content}
    </button>
  );
};

export default Button;
