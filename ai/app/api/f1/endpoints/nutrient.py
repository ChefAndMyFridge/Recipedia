# app/api/f1/endpoints/nutrient.py

# 실험용 테스트 코드입니다.

from typing import List, Optional
from pydantic import BaseModel
from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import JSONResponse
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

# 요청 모델: 클라이언트가 재료 이름을 전송합니다.
class NutrientRequest(BaseModel):
    ingredient_name: str

# 응답 모델: 각 영양소 항목을 포함한 100g 당 영양정보를 반환합니다.
class NutrientResponse(BaseModel):
    calories: float
    carbohydrate: float
    protein: float
    fat: float
    sodium: float
    sugars: float
    cholesterol: float
    saturatedFat: float
    unsaturatedFat: float
    transFat: float
    allergenInfo: str

@router.post(
    "/",
    response_model=NutrientResponse,
    summary="영양성분 추출",
    description="재료 이름을 기반으로 100g 당 영양성분 정보를 반환합니다."
)
async def get_nutrient_info(request: NutrientRequest):
    ingredient = request.ingredient_name.lower()
    
    # 예시: "당근"에 대한 영양정보 (실제 구현 시 LLM, DB, 외부 API 등을 활용)
    if ingredient == "당근":
        return NutrientResponse(
            calories=41.0,
            carbohydrate=9.6,
            protein=0.9,
            fat=0.24,
            sodium=69.0,
            sugars=4.7,
            cholesterol=0.0,
            saturatedFat=0.03,
            unsaturatedFat=0.21,
            transFat=0.0,
            allergenInfo=""
        )
    
    # 그 외 재료는 기본값(모두 0 또는 빈 문자열)을 반환합니다.
    return NutrientResponse(
        calories=0.0,
        carbohydrate=0.0,
        protein=0.0,
        fat=0.0,
        sodium=0.0,
        sugars=0.0,
        cholesterol=0.0,
        saturatedFat=0.0,
        unsaturatedFat=0.0,
        transFat=0.0,
        allergenInfo=""
    )
