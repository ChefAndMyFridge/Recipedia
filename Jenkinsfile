pipeline {
    agent any  // 어떤 Jenkins 에이전트에서도 실행 가능

    environment {
        HOST_URL = credentials('HOST_URL')
        MYSQL_ROOT_PASSWORD = credentials('MYSQL_ROOT_PASSWORD')
        MYSQL_DATABASE = credentials('MYSQL_DATABASE')
        ELASTIC_PASSWORD = credentials('ELASTIC_PASSWORD')
        VITE_API_URL = credentials('VITE_API_URL')
        YOUTUBE_API_KEY = credentials('YOUTUBE_API_KEY')
        YOUTUBE_API_KEYS = credentials('YOUTUBE_API_KEYS')
        OPENAI_API_KEY = credentials('OPENAI_API_KEY')
        USDA_API_KEY = credentials('USDA_API_KEY')
        ALLOWED_ORIGINS = credentials('ALLOWED_ORIGINS')
        X_API = credentials('X_API')
        FASTAPI_SECURITY_KEY = credentials('FASTAPI_SECURITY_KEY')
        FASTAPI_PROFILE = credentials('FASTAPI_PROFILE')\
        ADMIN_PW = credentials('ADMIN_PW')
    }

    stages {
        stage('git repository pull, sourcecode update') {
            steps {
                cleanWs()  // Jenkins 작업 공간을 완전히 초기화
                script {
                    echo "Checking out branch: ${env.BRANCH_NAME}"
                    git branch: env.BRANCH_NAME, credentialsId: 'my-gitlab-token', url: 'https://lab.ssafy.com/s12-s-project/S12P21S003.git'
                }
            }
        }

        stage('serving frontend build file to nginx') {
            steps {
                script {
                    def viteReleaseApiUrl = "https://j12s003.p.ssafy.io/api"
                    def viteMasterApiUrl = "https://j12s003.p.ssafy.io/api"
                    def baseUrl = env.BRANCH_NAME == "master" ? "/master" : "/"

                    echo "✅ BRANCH_NAME: ${env.BRANCH_NAME}"
                    echo "🌐 VITE_MASTER_API_URL: ${viteMasterApiUrl}"
                    echo "🌐 VITE_RELEASE_API_URL: ${viteReleaseApiUrl}"
                    echo "📁 VITE_BASE_URL: ${baseUrl}"


                    sh """
                    cd ${env.WORKSPACE}/frontend
                    echo "VITE_RELEASE_API_URL=${viteReleaseApiUrl}" > .env
                    echo "VITE_MASTER_API_URL=${viteMasterApiUrl}" >> .env
                    echo "VITE_BASE_URL=${baseUrl}" >> .env

                    yarn install --frozen-lockfile
                    yarn build

                    rm -rf /front_build/${env.BRANCH_NAME}/html
                    mkdir -p /front_build/${env.BRANCH_NAME}/html
                    cp -r dist/* /front_build/${env.BRANCH_NAME}/html/
                    """
                }
            }
        }

        stage('Build & Start New App Containers') {
            steps {
                script {
                    sh """
                    cd ${env.WORKSPACE}
                    HOST_URL=${env.HOST_URL} \
                    MYSQL_ROOT_PASSWORD=${env.MYSQL_ROOT_PASSWORD} \
                    MYSQL_DATABASE=${env.MYSQL_DATABASE} \
                    YOUTUBE_API_KEY='${env.YOUTUBE_API_KEY}' \
                    YOUTUBE_API_KEYS='${env.YOUTUBE_API_KEYS}' \
                    OPENAI_API_KEY=${env.OPENAI_API_KEY} \
                    USDA_API_KEY=${env.USDA_API_KEY} \
                    ELASTIC_PASSWORD=${env.ELASTIC_PASSWORD} \
                    ALLOWED_ORIGINS='${env.ALLOWED_ORIGINS}' \
                    BRANCH_NAME=${env.BRANCH_NAME} \
                    X_API=${env.X_API} \
                    FASTAPI_SECURITY_KEY=${env.FASTAPI_SECURITY_KEY} \
                    ENV=${env.FASTAPI_PROFILE} \
                    ADMIN_PW=${env.ADMIN_PW} \
                    cp .env.${env.BRANCH_NAME} .env
                    docker-compose -f docker-compose-app.yml up -d --build
                    """
                }
            }
        }

        stage("nginx restart") {
            steps {
                script {
                    sh """
                    docker exec my-nginx nginx -s reload
                    """
                }
            }
        }
    }
}
