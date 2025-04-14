# RECIPEDIA

<img src="https://github.com/user-attachments/assets/76b3ab3f-0bfc-4f2a-8f29-abaee28d3013" width="50%" alt="레시피디아 로고"/>

### Recipedia 링크 : https://j12s003.p.ssafy.io/

## 목차

1. [프로젝트 개요](#프로젝트-개요)
2. [기능 소개](#기능-소개)
3. [기술 스택](#기술-스택)
4. [서비스 아키텍처](#서비스-아키텍처)
5. [ERD](#erd)
6. [프로젝트 구조](#프로젝트-구조)
   - [Frontend](#frontend-1)
   - [Backend](#backend-1)
   - [AI](#ai-1)
7. [포팅메뉴얼](#포팅메뉴얼)
8. [팀 소개](#팀-소개)

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

## 기능 소개

### 메인 화면

#### 재료 입출고

<img src="https://github.com/user-attachments/assets/759243c5-b1e1-4fea-89fd-e285e0170f70" width="50%" alt="재료 입출고 화면"/>

#### 개인 선호 필터링

<img src="https://github.com/user-attachments/assets/e97b8ab4-d1b0-4dd5-a5b2-142e611cc804" width="50%" alt="개인 선호 필터링 화면"/>

### 레시피 생성

<img src="https://github.com/user-attachments/assets/b2a068d4-5f51-47c4-b7fc-3450a7259e86" width="50%" alt="레시피 생성 화면"/>

### 레시피 추출

<img src="https://github.com/user-attachments/assets/1b463bfd-c717-4a69-9c16-8ec9529cc778" width="50%" alt="레시피 추출 화면"/>

### 사용자 프로필

<div align="center">
    <img src="https://github.com/user-attachments/assets/6ee3855b-f489-4f12-ab66-9d2e9de9b2ac" width="45%" alt="프로필 홈 화면"/>
    <img src="https://github.com/user-attachments/assets/74d0e974-032e-423c-bcb0-92b3807df4f3" width="45%" alt="프로필 전환 화면"/>
</div>


#### 즐겨찾기

<img src="https://github.com/user-attachments/assets/2a58a8c3-1ebf-4545-88db-79504521a6be" width="50%" alt="즐겨찾기 화면"/>

#### 이전 레시피

<img src="https://github.com/user-attachments/assets/6703affc-dbe9-4a65-93ba-31433955e6f5" width="50%" alt="이전 레시피 화면"/>

## 기술 스택

**Frontend** <br> ![React](https://img.shields.io/badge/react-61DAFB.svg?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-3178C6.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Yarn Berry](https://img.shields.io/badge/yarn_berry-2C8EBB.svg?style=for-the-badge&logo=yarn&logoColor=white)
![tailwind](https://img.shields.io/badge/tailwind-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Zustand](https://img.shields.io/badge/zustand-E26529.svg?style=for-the-badge&logo=zustand&logoColor=white)
![React Query](https://img.shields.io/badge/react_query-FF4154.svg?style=for-the-badge&logo=reactquery&logoColor=white)
![Axios](https://img.shields.io/badge/axios-000000.svg?style=for-the-badge&logo=axios&logoColor=white)

**Backend** <br> ![Java](https://img.shields.io/badge/java-3670A0?style=for-the-badge&logo=java&logoColor=ffdd54)
![Spring](https://img.shields.io/badge/spring_boot-6DB33F.svg?style=for-the-badge&logo=springboot&logoColor=white)
![Spring Data JPA](https://img.shields.io/badge/spring_data_jpa-6DB33F.svg?style=for-the-badge&logo=springdatajpa&logoColor=white)
![QueryDSL](https://img.shields.io/badge/QueryDSL-0089CF?style=for-the-badge&logo=querydsl&logoColor=white)
![MySQL](https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Elastic Search](https://img.shields.io/badge/elastic-005571?style=for-the-badge&logo=elastic&logoColor=white)
![Webflux](https://img.shields.io/badge/webflux-000000?style=for-the-badge&logo=webflux&logoColor=white)

**AI** <br> ![Python](https://img.shields.io/badge/python-3776AB?style=for-the-badge&logo=python&logoColor=FFFFFF)
![Fast API](https://img.shields.io/badge/Fast_API-009688.svg?style=for-the-badge&logo=FastAPI&logoColor=white)
![OpenAI](https://img.shields.io/badge/openAI-412991.svg?style=for-the-badge&logo=openai&logoColor=white)
![YoutubeAPI](https://img.shields.io/badge/Youtube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)

**DevOps** <br> ![NginX](https://img.shields.io/badge/NginX-009639.svg?style=for-the-badge&logo=nginx&logoColor=white)
![Docker](https://img.shields.io/badge/docker-2496ED.svg?style=for-the-badge&logo=docker&logoColor=white)
![Jenkins](https://img.shields.io/badge/jenkins-D24939.svg?style=for-the-badge&logo=jenkins&logoColor=white)
![Amazon EC2](https://img.shields.io/badge/amazon_ec2-FF9900.svg?style=for-the-badge&logo=amazonec2&logoColor=white)

**Tools** <br> ![GitLab](https://img.shields.io/badge/gitlab-FC6D26.svg?style=for-the-badge&logo=gitlab&logoColor=white)
![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white)
![Intellij IDEA](https://img.shields.io/badge/Intelij_IDEA-000000?style=for-the-badge&logo=intellijidea&logoColor=white)
![Swagger](https://img.shields.io/badge/swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)
![Figma](https://img.shields.io/badge/figma-F24E1E.svg?style=for-the-badge&logo=figma&logoColor=white)
![Notion](https://img.shields.io/badge/Notion-%23000000.svg?style=for-the-badge&logo=notion&logoColor=white)
![Jira](https://img.shields.io/badge/Jira-%23FFFFFF.svg?style=for-the-badge&logo=jira&logoColor=blue)

<br>

## 서비스 아키텍처
<img src="https://github.com/user-attachments/assets/90a51318-c5e9-450d-85b0-92414097712f" alt="ERD"/>

<br>

## ERD

<img src="https://github.com/user-attachments/assets/1c30769b-b566-4002-ab3a-3fff3769b9b2" width="50%" alt="ERD"/>

<br>

## 프로젝트 구조

### Frontend

```text
client
├── .yarn
├── public
└── src
    ├── apis
    ├── assets
    │   ├── fonts
    │   ├── icons
    │   ├── images
    │   └── sounds
    ├── components
    │   ├── common
    │   ├── Layout
    │   ├── profile
    │   └── recipeRating
    ├── data
    ├── hooks
    ├── mocks
    ├── pages
    ├── stores
    ├── styles
    ├── types
    ├── utils
    ├── App.tsx
    ├── index.css
    ├── main.tsx
    └── vite-env.d.ts
```

### BackEnd

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

### AI

```text
ai
├── app
│   ├── api
│   │   └── f1
│   │       └── endpoints
│   ├── core
│   ├── models
│   ├── services
│   │   ├── LLM
│   │   └── external_api
│   └── utils
│       └── prompts
└── test
    └── utils
```

## 포팅매뉴얼

[포팅매뉴얼 바로가기](https://github.com/ChefAndMyFridge/Recipedia/tree/master/exec)

## 팀 소개

| 이름           | 역할 및 구현 기능                                                                                    |
| -------------- | ---------------------------------------------------------------------------------------------------- |
| 🟧이하영(팀장) | **Frontend**<br>- 화면 UI/UX 설계 <br>- 레시피 화면 구현 및 API 연결<br>                             |
| 🟩이성준       | **Frontend**<br>- 화면 UI/UX 설계<br>- 재료 화면 구현 및 API 연결 <br>                               |
| 🟦민경훈       | **Backend**<br>- DB 설계<br>- 재료, 레시피 등 API 구현<br> <br>                                      |
| 🟥최효재       | **Infra**<br>- Docker, Docker-compose로 프로젝트 실행과 배포 환경 구축<br>- Jenkins로 CI/CD 구축<br> |
| 🟨노규헌       | **AI**<br>- 레시피 생성 로직 설계 및 구현 <br>- AI 성능평가 및 고도화 <br>                           |
| 🟪안태현       | **AI**<br>- 레시피 추출 로직 설계 및 구현 <br>- AI 성능평가 및 고도화 <br>                           |
