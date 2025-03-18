import { useParams } from "react-router-dom";
import ErrorPage from "@components/common/error/ErrorPage";
import LoadingPlayer from "@components/common/loading/LoadingPlayer";
import { useGetRecipeDetail } from "@hooks/useRecipeHooks";
import DetailRecipeLandscapePage from "@pages/detailRecipe/DetailRecipeLandscapePage";
import DetailRecipePortraitPage from "@pages/detailRecipe/DetailRecipePortraitPage";

const DetailRecipePage = () => {
  //detailRecipe 페이지 진입 시, 해당 레시피 정보 get api 호출 예정
  const { recipeId } = useParams();

  // API 호출로 상세 정보 가져오기
  const { isLoading, isError, isFetching, data } = useGetRecipeDetail(Number(recipeId));

  if (isLoading || isFetching) return <LoadingPlayer />;
  if (isError) return <ErrorPage />;
  if (!data) return <LoadingPlayer />;

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
