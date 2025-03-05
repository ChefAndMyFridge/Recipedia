# app/api/f1/endpoints/query.py

from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import JSONResponse
from app.services.youtube_query import YoutubeQuery
from app.services.recipe_maker import RecipeMaker
from app.models.ingredients import Ingredients
from app.utils.docs import QueryDocs

router = APIRouter()
youtube = YoutubeQuery()
recipe_maker = RecipeMaker()
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

@router.get(
    "/recipe-maker",
    summary="레시피 생성 및 검색",
    description="재료 목록을 기반으로 음식 이름을 생성하고 YouTube 레시피 동영상을 검색합니다.",
    response_description="생성된 음식 목록, 동영상 정보 및 실행 시간"
)
async def recipe_maker_endpoint(request: Request):
    try:
        # 비동기로 전체 프로세스 실행
        result = await recipe_maker.run()
        return JSONResponse(status_code=200, content=result)
    except Exception as e:
        logger.error(f"레시피 메이커 실행 오류: {e}")
        raise HTTPException(status_code=500, detail="레시피 생성 중 오류가 발생했습니다.")