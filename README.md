## ~~로컬에서 클라이언트 - 서버 테스트하기~~
# 2025-03-14 UPDATE
## 로컬에서 클라우드로 API 테스트하기
현재 Https 적용으로 local에서 ssh인증과 테스트 환경 설치가 매우 번거로운 관계로,,<br>
각각의 프론트 백엔드에 테스트를 해야하는 상황<br>

### 프론트 테스트
localhost로 실행후 API 호출 URL을 our-domain/api 로 기존 그대로 날리면됌

### 백엔드 테스트
IDE(Intellij)에서 실행하거나 Docker-compose로 실행<br>
전자는 데이터베이스로 H2를 쓰고, 후자는 MySQL을 사용<br>
전자가 훨씬 빨라서 전자 추천<br>

### Docker-compose 실행 방법
root 디렉토리에 기존의 docker-compose.yml에서 docker-compose-infra.yml과 docker-compose-app.yml로 나뉘었음<br>
infra.yml에선 Jenkins와 MySQL이 존재하며 항상 Running 상태여야함<br>
app.yml는 프론트-백엔드 소스코드가 들어가며 변경사항이 있을경우 재빌드해야함<br><br>

즉, infra를 먼저 실행해놓고, 소스코드 변경사항이 생길때마다 app만 down과 up을 반복해주면 됌<br>
docker-compose파일이 2개이므로 실행할때 명령어가 살짝 바뀜, 즉 특정 파일을 지정해줘야함<br><br>

기존의 명령어가 `docker-compose down`, `docker-compose up -d (--build)`였다면<br>
<b>`docker-compose -f (docker compose 파일명) (커맨드)`로 실행해야함<b><br>
인프라 예시: `docker-compose -f docker-compose-infra.yml up -d`<br>
앱 예시: `docker-compose -f docker-compose-app.yml down`, `docker-compose -f docker-compose-app.yml up -d --build`


# 초기 세팅
### 선결조건
Docker desktop 다운로드 [도커 데스크탑 설치 링크](https://docs.docker.com/desktop/setup/install/windows-install/)<br>
Docker, Docker compose 따로 설치 안해도 위에거만 설치하면 해결됌

### 실행 순서
0. notion의 [노션 .env 파일 문서 링크](https://www.notion.so/INFRA-END-1ac7af7f90a080bc8527c65a67ae7bb0)에서 가이드에 따라 .env 파일을 삽입

1. 프로젝트 루트 디렉토리에서 터미널 창 오픈(CMD, bash), 혹은 vscode 이용

2. git clone 이후나 git pull로 소스코드 업데이트가 생겼을 경우에는 docker compose up -d --build 실행<br>

3. 위의 과정을 한번 거친 이후에는 docker compose up -d 실행<br>

4. 소스코드가 변경됐으면 --build를 넣어줘야함

5. 뭔가 안된다 싶으면 --build 넣고 해보자

6. Docker desktop의 container 창에서 모든 서버가 녹색불이 들어오면 실행 성공

7. docker compose down 으로 컨테이너 종료

### 모니터링
Docker desktop의 container에서 개별 서버를 클릭하면 해당 서버의 로그를 볼 수 있음<br>
[Swagger 링크](http://localhost:8080/swagger-ui/index.html)에서 swagger를 통해 API 테스트 가능

### 추신
지금 현재 AWS가 없기때문에 불가피하게 이런 방식을 채택하고 있는점 양해드립니다<br>
추후에 AWS와 jenkins를 이용한 클라우드 서버 운용이 가능해지면 업데이트할 생각입니다<br>
docker compose up을 자주 쳐야해서 생기는 불편함 너그러이 봐주세요


