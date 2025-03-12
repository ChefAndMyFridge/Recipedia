# app/api/f1/endpoints/recipe.py

from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import JSONResponse
from app.utils.docs import RecipeDocs
from app.services.recipe_summary.summary_test import RecipeSummary

router = APIRouter()
docs = RecipeDocs()
recipe_summary = RecipeSummary()

@router.get("/",
    summary="텍스트 레시피 추출",
    description="URL로 부터 자막을 가져와 텍스트로 된 레시피를 추출합니다.",
    response_description="레시피 추출 결과",
    responses=docs.base["res"],
)
async def get_recipe_summary(request: Request, video_id: str):
    try:
        summary = await recipe_summary.summarize_recipe(video_id)
        return JSONResponse(status_code=200, content={"summary": summary})
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"요약 처리 중 오류가 발생했습니다: {e}")
