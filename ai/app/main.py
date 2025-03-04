# app/main.py

# FastAPI 서버 기본 설정
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.f1 import endpoints

app = FastAPI(title=settings.APP_NAME, debug=settings.DEBUG)

# CORS 미들웨어 등록
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록
app.include_router(endpoints.router, prefix="/api/f1")

@app.get("/")
async def read_root(request: Request):
    return JSONResponse(status_code=200, content={"message": "Hello, FastAPI!"},)
