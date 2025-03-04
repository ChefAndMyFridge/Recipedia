## 로컬에서 클라이언트 - 서버 테스트하기

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


