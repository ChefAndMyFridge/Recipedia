const DetailIngredientImage = ({ imgSrc }: { imgSrc: string }) => {
  return (
    <div className="h-[30vh] w-full overflow-hidden">
      <img src={imgSrc} alt={imgSrc} className="w-full h-full object-cover object-center" />
    </div>
  );
};

export default DetailIngredientImage;
