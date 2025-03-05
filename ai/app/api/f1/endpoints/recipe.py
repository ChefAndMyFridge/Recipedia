# app/api/f1/endpoints/recipe.py

from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import JSONResponse
from app.services.YoutubeQuery import YoutubeQuery
from app.utils.docs import RecipeDocs

router = APIRouter()
youtube = YoutubeQuery()
docs = RecipeDocs()

@router.get("/",
    summary="텍스트 레시피 추출",
    description="URL로 부터 자막을 가져와 텍스트로 된 레시피를 추출합니다.",
    response_description="레시피 추출 결과",
    responses=docs.base["res"],
)
async def get_recipe():
    return {"message": "Recipe endpoint"}
