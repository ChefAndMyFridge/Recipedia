import { useParams } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { useEffect, useState } from "react";

import ErrorPage from "@components/common/error/ErrorPage";
import LoadingPlayer from "@components/common/loading/LoadingPlayer";
import Modal from "@components/common/modal/Modal";

import { useGetRecipeDetail } from "@hooks/useRecipeHooks";
import useRecipeStore from "@stores/recipeStore";

import DetailRecipeLandscapePage from "@pages/detailRecipe/DetailRecipeLandscapePage";
import DetailRecipePortraitPage from "@pages/detailRecipe/DetailRecipePortraitPage";

const DetailRecipePage = () => {
  const { recipeId } = useParams();
  const [isStoreReady, setIsStoreReady] = useState(false);
  const { detailRecipe } = useRecipeStore();

  // API 호출로 상세 정보 가져오기
  const { isLoading, isFetching, isError, data } = useGetRecipeDetail(Number(recipeId));

  // 스토어 값이 API 응답으로 업데이트되었는지 확인
  useEffect(() => {
    if (data && detailRecipe.recipeId === Number(recipeId) && detailRecipe.recipeId !== 0) {
      setIsStoreReady(true);
    } else {
      setIsStoreReady(false);
    }
  }, [data, detailRecipe, recipeId]);

  if (isLoading || isFetching || !data || !isStoreReady) return <LoadingPlayer />;
  if (isError) return <ErrorPage />;

  return (
    <>
      <ErrorBoundary FallbackComponent={ErrorPage}>
        {/* 세로모드 레이아웃 */}
        <div className="portrait:block landscape:hidden h-full">
          <DetailRecipePortraitPage />
        </div>
        {/* 가로모드 레이아웃 */}
        <div className="landscape:block portrait:hidden h-full">
          <DetailRecipeLandscapePage />
        </div>
        <Modal />
      </ErrorBoundary>
    </>
  );
};

export default DetailRecipePage;
