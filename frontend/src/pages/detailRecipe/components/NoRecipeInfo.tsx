import IconError from "@assets/icons/IconError";

const NoRecipeInfo = () => {
  return (
    <div className="flex flex-col w-full items-center justify-center gap-4">
      <IconError width={70} height={70} />
      <p className="text-base font-preMedium text-longContent">레시피 정보를 제공하지 않는 영상입니다.</p>
    </div>
  );
};

export default NoRecipeInfo;
