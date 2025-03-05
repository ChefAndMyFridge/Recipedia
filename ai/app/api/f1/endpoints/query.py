# app/api/f1/endpoints/query.py

from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import JSONResponse
from app.services.YoutubeQuery import YoutubeQuery
from app.models.ingredients import Ingredients
from app.utils.docs import QueryDocs

router = APIRouter()
youtube = YoutubeQuery()
docs = QueryDocs()

@router.post("/",
    summary="유튜브 레시피 영상 URL 획득",
    description="재료목록으로 만들 수 있는 요리 레시피 영상 제목과 URL을 얻습니다.",
    response_description="유튜브 레시피 검색 결과",
    responses=docs.base["res"],
)
async def get_recipe_url(request: Request, data: Ingredients=docs.base["data"]):
    recipe_name = await youtube.make_query_from_items(data)

    print(recipe_name)

    videos = await youtube.search_from_youtube(recipe_name)

    return JSONResponse(status_code=200, content=videos)
