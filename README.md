## 로컬에서 클라이언트 - 서버 테스트하기

### 선결조건
Docker desktop 다운로드 [도커 데스크탑 설치 링크](https://docs.docker.com/desktop/setup/install/windows-install/)<br>
Docker, Docker compose 따로 설치 안해도 위에거만 설치하면 해결됌

### 실행 순서
1. 프로젝트 루트 디렉토리에서 docker-compsoe.yml 파일 확인

2. docker compose up -d (--build) 실행<br>
- --build는 도커 이미지를 재빌드하기 때문에 소스코드의 변경사항이 생길때는 명령어에 같이 써줘야함
이 이후에는 제외해도 무방<br>
- 즉, gitlab에서 소스코드를 새로 pull 받았거나, 로컬에서 새로운 소스코드를 수정할때는 --build를 붙여야함

3. docker compose down 으로 컨테이너 종료

### 모니터링
Docker desktop을 실행하면 현재 실행중인 컨테이너가 보이고, 개별 컨테이너를 클릭하면 log들을 볼 수 있음

