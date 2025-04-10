# RECIPEDIA

<img src="/uploads/350bf6bbb93dbe34f7fb9cf9f61b5f00/recipediaLogo.png" width="50%" alt="레시피디아 로고"/>

## 프로젝트 개요

### 📋 **서비스 개요**

- 생성형 AI 기반 레시피 추천 서비스
- 냉장고 재료 및 개인 선호를 반영한 레시피를 제공하는 서비스입니다.
- **기간:** 2025/2/24 ~ 2025/4/11 (7주)

### 💰 **서비스 특징**

1. **재료 입출고**
   - 사용자는 자유롭게 재료를 입출고할 수 있습니다.
2. **레시피 생성**
   - 냉장고 내 재료 및 개인 선호도 (선호/비선호 재료, 식단, 알러지 정보)를 기반으로 LLM을 활용하여 요리 이름을 생성하고,
     유튜브 내 레시피 영상 리스트를 제공합니다.
3. **단계별 레시피 텍스트**
   - 레시피 영상 내 자막 정보를 추출 및 요약하여 단계별 레시피 텍스트를 제공합니다.
   - 타임스탬프, 자동 스크롤 등의 기능을 통해 간편하게 레시피를 확인할 수 있습니다.
   - 타이머, 요리 재료 정보 등 요리에 도움이 되는 기능들을 제공받을 수 있습니다.
4. **즐겨찾기 및 이전 레시피**
   - 마음에 드는 레시피를 저장하고, 과거에 만든 요리를 다시 찾아볼 수 있습니다.

## 기술 스택

**Backend** <br> ![Java](https://img.shields.io/badge/java-3670A0?style=for-the-badge&logo=java&logoColor=ffdd54)
![Spring](https://img.shields.io/badge/spring_boot-6DB33F.svg?style=for-the-badge&logo=springboot&logoColor=white)
![Spring Data JPA](https://img.shields.io/badge/spring_data_jpa-6DB33F.svg?style=for-the-badge&logo=springdatajpa&logoColor=white)
![QueryDSL](https://img.shields.io/badge/QueryDSL-0089CF?style=for-the-badge&logo=querydsl&logoColor=white)
![MySQL](https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Elastic Search](https://img.shields.io/badge/elastic-005571?style=for-the-badge&logo=elastic&logoColor=white)
![Webflux](https://img.shields.io/badge/webflux-000000?style=for-the-badge&logo=webflux&logoColor=white)

## 프로젝트 구조

```text
backend
└── src
    └── main
        ├── java
        │   └── com
        │       └── recipidia
        │           ├── aop
        │           ├── auth
        │           │   ├── config
        │           │   ├── controller
        │           │   ├── dto
        │           │   └── jwt
        │           ├── config
        │           ├── exception
        │           ├── filter
        │           │   ├── controller
        │           │   ├── converter
        │           │   ├── dto
        │           │   ├── entity
        │           │   ├── repository
        │           │   └── service
        │           ├── ingredient
        │           │   ├── controller
        │           │   ├── document
        │           │   ├── dto
        │           │   ├── entity
        │           │   ├── enums
        │           │   ├── exception
        │           │   ├── handler
        │           │   ├── repository
        │           │   │   └── querydsl
        │           │   ├── request
        │           │   ├── response
        │           │   ├── scheduler
        │           │   └── service
        │           ├── member
        │           │   ├── controller
        │           │   ├── dto
        │           │   ├── entity
        │           │   ├── exception
        │           │   ├── handler
        │           │   ├── repository
        │           │   ├── request
        │           │   ├── response
        │           │   └── service
        │           └── recipe
        │               ├── controller
        │               ├── converter
        │               ├── dto
        │               ├── entity
        │               ├── exception
        │               ├── handler
        │               ├── repository
        │               ├── request
        │               ├── response
        │               └── service
        └── resources
            ├── application.yml
            └── data
```

## 프로젝트 설정

Jenkins Credential에 다음 값들을 설정합니다.
```
ELASTIC_PASSWORD : Elastic Search의 비밀번호를 설정합니다.
MYSQL_ROOT_PASSWORD : MySQL의 비밀번호를 설정합니다.
HOST_URL : 프론트엔드의 URL을 설정합니다.
FASTAPI_API_URL : FastAPI의 URL을 설정합니다.
X_API : FastAPI와 통신을 위한 헤더로, FASTAPI_SECURITY_KEY와 동일한 값으로 설정합니다.
ADMIN_PW : admin 계정에 사용할 비밀번호를 입력합니다.
```


## Config 파일 설정

## 디렉토리 상세 설명

1. aop
   컨트롤러 메서드 실행 전/후 로그 출력
   요청정보와 처리 시간을 측정하여 출력함

2. auth
   JWT 기반 계정 관리
   admin 계정 설정
   로그인 API

3. config
   비동기 처리, JsonConverter를 위한 ObjectMapper 설정
   FastAPI와의 통신을 위한 WebClient 설정, Security 설정
   Swagger 레이아웃 정렬 및 JWT 인증용 openapi 설정
   CSV 기반 초기 식재료 정보 데이터셋 입력 함수

4. exception
   GlobalExceptionHandler 설정

5. filter
   멤버 별 개인화 필터 API - 조회/수정
   레시피 검색 시 필터를 적용해 고내 식재료 필터링 서비스 구현

6. ingredient
   식재료 관리 API - 입고/출고/조회
   식재료 영양정보 업데이트 서비스 - FastAPI /nutrient로 요청
   Elastic Search 기반 자동완성 API

7. member
   냉장고 멤버 프로필 API - 등록/조회/삭제
   각 멤버 별 즐겨찾기/평점 API - 등록/수정

8. 레시피 API

작성 중 입니다...