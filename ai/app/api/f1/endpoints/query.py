# app/api/f1/endpoints/query.py

from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import JSONResponse
from app.services.YoutubeQuery import YoutubeQuery
from app.models.ingredients import Ingredients

router = APIRouter()
youtube = YoutubeQuery()

dummy = Ingredients(items={"계란": 1, "파": 1}, user="아버지")

@router.post("/")
async def get_recipe_url(request: Request, test: int=1, data: Ingredients=dummy):
    if (test==2):
        raise HTTPException(status_code=404, detail="Not Found")
    
    recipe_name = await youtube.make_query_from_items(data)

    print(recipe_name)

    videos = await youtube.search_from_youtube(recipe_name)

    return JSONResponse(status_code=200, content=videos)
