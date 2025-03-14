import DetailRecipeLandscapePage from "@pages/detailRecipe/DetailRecipeLandscapePage";
import DetailRecipePortraitPage from "@pages/detailRecipe/DetailRecipePortraitPage";

const DetailRecipePage = () => {
  return (
    <>
      {/* 세로모드 레이아웃 */}
      <div className="portrait:block landscape:hidden h-screen">
        <DetailRecipePortraitPage />
      </div>
      {/* 가로모드 레이아웃 */}
      <div className="landscape:block portrait:hidden h-full">
        <DetailRecipeLandscapePage />
      </div>
    </>
  );
};

export default DetailRecipePage;
