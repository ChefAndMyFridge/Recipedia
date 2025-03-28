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
  const [isPortrait, setIsPortrait] = useState(window.matchMedia("(orientation: portrait)").matches);
  const { detailRecipe, setHasFetchedDetailRecipe } = useRecipeStore();

  // API 호출로 상세 정보 가져오기
  const { isLoading, isFetching, isError, data } = useGetRecipeDetail(Number(recipeId));

  // 스토어 값이 API 응답으로 업데이트되었는지 확인
  useEffect(() => {
    // console.log("data", data);
    // console.log("detailRecipe", detailRecipe.recipeId);
    // if (data && detailRecipe.recipeId === Number(recipeId) && detailRecipe.recipeId !== 0) {
    //   setIsStoreReady(true);
    // } else {
    //   setIsStoreReady(false);
    // }

    if (data && detailRecipe.recipeId === Number(recipeId) && detailRecipe.recipeId !== 0) {
      console.log("data", data);
      setHasFetchedDetailRecipe(true);
    }
  }, [data]);

  // 화면 방향 변경 감지
  useEffect(() => {
    const handleOrientationChange = () => {
      setIsPortrait(window.matchMedia("(orientation: portrait)").matches);
    };

    window.addEventListener("resize", handleOrientationChange);
    return () => {
      window.removeEventListener("resize", handleOrientationChange);
    };
  }, []);

  if (isLoading || isFetching || !data) return <LoadingPlayer />;
  if (isError) return <ErrorPage />;

  return (
    <>
      <ErrorBoundary FallbackComponent={ErrorPage}>
        {isPortrait ? <DetailRecipePortraitPage /> : <DetailRecipeLandscapePage />}
        <Modal />
      </ErrorBoundary>
    </>
  );
};

export default DetailRecipePage;
