import { Link } from "react-router-dom";

const HomeHeaderButtons = () => {
  return (
    <div className="flex h-fit justify-between items-center gap-2">
      <Link to="" className="flex flex-1 p-2 w-10 h-10 bg-white rounded-full items-center justify-center">
        <button>S</button>
      </Link>
      <button className="flex flex-1 p-2 w-10 h-10 bg-white  rounded-full items-center justify-center">P</button>
    </div>
  );
};

export default HomeHeaderButtons;
