def releaseNotes = ""
def latestCommit = ""

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
        FASTAPI_PROFILE = credentials('FASTAPI_PROFILE')
        ADMIN_PW = credentials('ADMIN_PW')
        MATTERMOST_WEBHOOK_URL = credentials('MATTERMOST_WEBHOOK_URL')
    }

    stages {
        stage('git repository pull, sourcecode update') {
            steps {
                cleanWs()  // Jenkins 작업 공간을 완전히 초기화
                script {
                    // 1. Jenkins의 인증된 git checkout 먼저 실행
                    git branch: env.BRANCH_NAME, credentialsId: 'my-gitlab-token',
                        url: 'https://lab.ssafy.com/s12-s-project/S12P21S003.git'

                    // 2. 인증 포함 fetch (origin 최신화)
                    withCredentials([usernamePassword(credentialsId: 'my-gitlab-token', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PASS')]) {
                        sh "git fetch https://${GIT_USER}:${GIT_PASS}@lab.ssafy.com/s12-s-project/S12P21S003.git ${env.BRANCH_NAME}"
                    }

                    // 3. 이전 origin 커밋 기준점 추출
                    def baseCommit = sh(
                        script: "git rev-parse origin/${env.BRANCH_NAME}",
                        returnStdout: true
                    ).trim()

                    // 4. release notes 생성
                    releaseNotes = sh(
                        script: "git log -n 5 --pretty=format:'- %h - %s'",
                        returnStdout: true
                    ).trim()
                    
                    if (!releaseNotes) {
                        releaseNotes = "- No new commits."
                    }
                    releaseNotes = "```\n${releaseNotes}\n```"

                    // 5. 최신 커밋 정보도 따로 저장
                    latestCommit = sh(
                        script: "git log -1 --pretty=format:'%h - %s'",
                        returnStdout: true
                    ).trim()

                    sendMattermostNotification('STARTED', releaseNotes)
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

    post {
        success {
            sendMattermostNotification('SUCCESS', releaseNotes, latestCommit)
        }

        failure {
            sendMattermostNotification('FAILURE', releaseNotes, latestCommit)
        }

        always {
            cleanWs()
        }
    }
}

def sendMattermostNotification(String status, String releaseNotes = "- No release notes.", String commit = "Unknown") {
    def emoji
    def color
    switch (status) {
        case 'STARTED':
            emoji = "🚀"
            break
        case 'SUCCESS':
            emoji = "✅"
            break
        case 'FAILURE':
            emoji = "❌"
            break
        default:
            emoji = "ℹ️"
    }

    def user = currentBuild.getBuildCauses()[0]?.userName ?: '자동 트리거'
    def buildUrl = "${env.BUILD_URL}console"
    def timestamp = new Date().format("yyyy-MM-dd HH:mm", TimeZone.getTimeZone('Asia/Seoul'))

    def message = """
    ${emoji} *[${env.BRANCH_NAME}]* 브랜치 - *${env.JOB_NAME}* 빌드 **${status}** (*#${env.BUILD_NUMBER}*)
    🔗 [콘솔 보기](${buildUrl})  
    🔀 ${commit}  
    👤 Triggered by: ${user}  
    🕒 ${timestamp}

    📋 *Release Notes*
    ${releaseNotes}
    """.stripIndent()

    // ⭐ JSON-safe로 메시지 이스케이프
    def safeMessage = message
        .replace("\\", "\\\\")
        .replace("\"", "\\\"")
        .replace("\n", "\\n")

    sh """
    curl -X POST -H 'Content-Type: application/json' \\
    -d "{ \\"text\\": \\"${safeMessage}\\" }" \\
    ${env.MATTERMOST_WEBHOOK_URL}
    """
}
