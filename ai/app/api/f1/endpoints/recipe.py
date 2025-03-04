# app/api/f1/endpoints/recipe.py

from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import JSONResponse
from app.services.YoutubeQuery import YoutubeQuery

router = APIRouter()
youtube = YoutubeQuery()

@router.get("/")
async def get_recipe():
    return {"message": "Recipe endpoint"}
