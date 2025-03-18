import logging
import os
from logging.handlers import RotatingFileHandler

# logs 디렉토리 자동 생성
LOG_DIR = os.path.join(os.path.dirname(
    os.path.dirname(__file__)), "..", "logs")
if not os.path.exists(LOG_DIR):
    os.makedirs(LOG_DIR)

# 로그 파일 경로
LOG_FILE = os.path.join(LOG_DIR, "app.log")
ERROR_LOG_FILE = os.path.join(LOG_DIR, "error.log")

# 포맷 설정
formatter = logging.Formatter("%(asctime)s - %(levelname)s - %(message)s")

# 일반 로그 핸들러 (파일 크기 초과 시 자동 회전)
file_handler = RotatingFileHandler(
    LOG_FILE, maxBytes=1_000_000, backupCount=5, encoding="utf-8")
file_handler.setFormatter(formatter)

# ERROR 로그 핸들러 (ERROR만 기록)
error_handler = RotatingFileHandler(
    ERROR_LOG_FILE, maxBytes=1_000_000, backupCount=3)
error_handler.setFormatter(formatter)
error_handler.setLevel(logging.ERROR)

#  콘솔 핸들러 (터미널 출력용)
console_handler = logging.StreamHandler()
console_handler.setFormatter(formatter)

# 로거 설정
logger = logging.getLogger("AppLogger")
logger.setLevel(logging.DEBUG)  # DEBUG부터 모든 로그 출력
logger.addHandler(file_handler)
logger.addHandler(error_handler)
logger.addHandler(console_handler)
