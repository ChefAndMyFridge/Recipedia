# 1️⃣ 공식 FastAPI 기반 Python 이미지 사용
FROM python:3.11-slim

# 2️⃣ 기본 유틸리티 및 빌드 도구 설치
RUN apt-get update && apt-get install -y \
    vim \
    curl \
    wget \
    net-tools \
    git \
    build-essential \
    gcc \
    g++ \
    python3-dev \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

RUN pip install --upgrade pip

# 3️⃣ requirements.txt 복사 및 설치
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# rouge_score 외 추가 패키지 설치
RUN pip install git+https://github.com/seof622/youtube-search-python

# 4️⃣ FastAPI 앱 코드 복사
COPY . .
ENV TZ=Asia/Seoul
RUN ln -sf /usr/share/zoneinfo/Asia/Seoul /etc/localtime
RUN echo "Asia/Seoul" > /etc/timezone

# 5️⃣ 컨테이너 실행 시 FastAPI 실행
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
