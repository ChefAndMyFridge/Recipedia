# 1️⃣ 공식 FastAPI 기반 Python 이미지 사용
FROM python:3.11-slim

# 2️⃣ 기본 유틸리티 설치
RUN apt-get update && apt-get install -y \
    vim \
    curl \
    wget \
    net-tools \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# 3️⃣ 의존성 파일 복사 및 설치
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt


# 4️⃣ FastAPI 앱 코드 복사
COPY . .

# 5️⃣ 컨테이너 실행 시 FastAPI 실행
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
