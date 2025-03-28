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

        stage('Stop & Remove Old App Containers') {
            steps {
                script {
                    sh """
                    cd ${env.WORKSPACE}
                    MYSQL_ROOT_PASSWORD=${env.MYSQL_ROOT_PASSWORD} \
                    MYSQL_DATABASE=${env.MYSQL_DATABASE} \
                    ELASTIC_PASSWORD=${env.ELASTIC_PASSWORD} \
                    docker-compose -f docker-compose-app.yml down
                    """
                }
            }
        }

        stage('serving frontend build file to nginx') {
            steps {
                script {
                    def viteApiUrl = "https://j12s003.p.ssafy.io/api"
                    def baseUrl = "/"

                    if (env.BRANCH_NAME == "master") {
                        viteApiUrl = "https://j12s003.p.ssafy.io/master/api"
                        baseUrl = "/${env.BRANCH_NAME}"
                    } 

                    echo "✅ BRANCH_NAME: ${env.BRANCH_NAME}"
                    echo "🌐 VITE_API_URL: ${viteApiUrl}"
                    echo "📁 VITE_BASE_URL: ${baseUrl}"


                    sh """
                    cd ${env.WORKSPACE}/frontend
                    echo "VITE_API_URL=${viteApiUrl}" > .env
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
                    def viteApiUrl = "https://j12s003.p.ssafy.io/api"
                    def fastapiApiUrl = "http://my-fastapi-release:8000"
                    def mysqlHost = "my-mysql-release"
                    if (env.BRANCH_NAME == "master") {
                        viteApiUrl = "https://j12s003.p.ssafy.io/master/api"
                        fastapiApiUrl = "http://my-fastapi-master:8000"
                        mysqlHost = "my-mysql-master"
                    } 

                    echo "✅ fastapiApiUrl: ${fastapiApiUrl}"
                    echo "🌐 VITE_API_URL: ${viteApiUrl}"
                    echo "📁 mysqlHost: ${mysqlHost}"


                    sh """
                    cd ${env.WORKSPACE}
                    HOST_URL=${env.HOST_URL} \
                    MYSQL_ROOT_PASSWORD=${env.MYSQL_ROOT_PASSWORD} \
                    MYSQL_DATABASE=${env.MYSQL_DATABASE} \
                    VITE_API_URL=${viteApiUrl} \
                    YOUTUBE_API_KEY='${env.YOUTUBE_API_KEY}' \
                    YOUTUBE_API_KEYS='${env.YOUTUBE_API_KEYS}' \
                    OPENAI_API_KEY=${env.OPENAI_API_KEY} \
                    USDA_API_KEY=${env.USDA_API_KEY} \
                    ELASTIC_PASSWORD=${env.ELASTIC_PASSWORD} \
                    ALLOWED_ORIGINS='${env.ALLOWED_ORIGINS}' \
                    BRANCH_NAME=${env.BRANCH_NAME} \
                    cp .env.${env.BRANCH_NAME} .env
                    docker-compose -f docker-compose-app.yml up -d --build
                    """
                }
            }
        }
    }
}
