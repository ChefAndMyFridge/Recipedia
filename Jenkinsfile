def releaseNotes = ""
def latestCommit = ""
def apiUrl = ""

pipeline {
    agent any  // 어떤 Jenkins 에이전트에서도 실행 가능

    environment {
        HOST_URL = credentials('HOST_URL')
        MYSQL_ROOT_PASSWORD = credentials('MYSQL_ROOT_PASSWORD')
        ELASTIC_PASSWORD = credentials('ELASTIC_PASSWORD')
        VITE_API_URL = credentials('VITE_API_URL')
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
        stage('Checkout Code') {
            steps {
                cleanWs()  // Jenkins 작업 공간을 완전히 초기화
                script {
                    // 1. Jenkins의 인증된 git checkout 먼저 실행
                    git branch: env.BRANCH_NAME, credentialsId: 'my-gitlab-token',
                        url: 'https://lab.ssafy.com/s12-s-project/S12P21S003.git'

                    // 2. release notes 생성
                    releaseNotes = sh(
                        // script: "git log -n 5 --pretty=format:'- %h - %s'",
                        script: "git log -n 5 --pretty=format:'%h - %s (by %an, %ad)' --date=format:'%Y-%m-%d %H:%M:%S'",
                        returnStdout: true
                    ).trim()
                    
                    // 3. 최신 커밋 정보도 따로 저장
                    latestCommit = sh(
                        script: "git log -1 --pretty=format:'%h - %s (by %an, %ad)' --date=format:'%Y-%m-%d %H:%M:%S'",
                        returnStdout: true
                    ).trim()
                }
            }
        }

        stage('Build Frontend') {
            steps {
                script {
                    def viteReleaseApiUrl = "https://j12s003.p.ssafy.io/api"
                    def viteMasterApiUrl = "https://j12s003.p.ssafy.io/master/api"
                    def baseUrl = env.BRANCH_NAME == "master" ? "/master" : "/"
                    apiUrl = env.BRANCH_NAME == "master" ? viteMasterApiUrl : viteReleaseApiUrl

                    sh """
                    cd ${env.WORKSPACE}/frontend
                    echo "VITE_BASE_URL=${baseUrl}" > .env
                    echo "VITE_API_URL=${apiUrl}" >> .env
                    echo "VITE_RELEASE_API_URL=${viteReleaseApiUrl}" >> .env
                    echo "VITE_MASTER_API_URL=${viteMasterApiUrl}" >> .env

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
                    echo "" >> .env
                    echo "COLOR=${env.DEPLOY_SLOT}" >> .env
                    cat .env
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

        stage("API Health Check via Login") {
            steps {
                script {
                    echo "🔐 withCredentials로 로그인 후 인증 API 확인"

                    withCredentials([usernamePassword(
                        credentialsId: 'login-creds',
                        usernameVariable: 'USERNAME',
                        passwordVariable: 'PASSWORD'
                    )]) {
                        // 1. 로그인 요청 → 토큰 추출
                        def response = sh(
                            script: """
                                docker exec my-nginx sh -c '
                                curl -s -w "\\n%{http_code}" \\
                                    -X POST ${apiUrl}/v1/auth/login \\
                                    -H "Content-Type: application/json" \\
                                    -d "{\\\\\\"username\\\\\\": \\\\\\"${USERNAME}\\\\\\", \\\\\\"password\\\\\\": \\\\\\"${PASSWORD}\\\\\\"}"
                                '
                            """,
                            returnStdout: true
                        ).trim()

                        def lines = response.readLines()
                        if (lines.size() < 2) {
                            def statusOnly = lines.size() == 1 ? lines[0] : "unknown"
                            error("❌ 로그인 실패 또는 응답 이상 (status=${statusOnly})")
                        }

                        def jwt = lines[0]
                        def status = lines[1]

                        echo "🔐 JWT: ${jwt}"
                        echo "🔍 응답 코드: ${status}"

                        if (status != "200") {
                            error("❌ 로그인 실패 또는 토큰 이상 (status=${status})")
                        }                        

                        // 2. 인증이 필요한 API 호출
                        def resCode = sh(
                            script: """
                                docker exec my-nginx curl -s -o /dev/null -w '%{http_code}' \\
                                    -H "Authorization: Bearer ${jwt}" \\
                                    ${apiUrl}/v1/ingredient
                            """,
                            returnStdout: true
                        ).trim()

                        if (resCode == "200") {
                            echo "✅ 인증된 API 호출 성공!"
                        } else {
                            error("❌ 인증 API 호출 실패 (응답코드: ${resCode})")
                        }
                    }

                }
            }
        }
    }

    post {
        success {
            script {
                def durationSec = (currentBuild.duration / 1000).toInteger()
                sendMattermostNotification('SUCCESS', releaseNotes, latestCommit, "${durationSec}초")
            }
        }

        failure {
            sendMattermostNotification('FAILURE', releaseNotes, latestCommit)
        }

        always {
            cleanWs()
        }
    }
}

def sendMattermostNotification(String status, String releaseNotes = "- No release notes.", String commit = "Unknown", String duration = "측정 불가") {
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

    def buildUrl = "${env.BUILD_URL}console"
    def timestamp = new Date().format("yyyy-MM-dd HH:mm", TimeZone.getTimeZone('Asia/Seoul'))

    def message = """
## **[${env.BRANCH_NAME}]** 브랜치 - **${env.JOB_NAME}** 빌드 **${status}** ${emoji} (*#${env.BUILD_NUMBER}*)
🔀 트리거 커밋 : **${commit}**
🕒 현재 시각 : **${timestamp}**
⏱️ 빌드 시간 : **${duration}**
🔗 [콘솔 보기](${buildUrl})  
    """.stripIndent().trim()

    escapedReleaseNotes = escapeJson(releaseNotes)
    def gitGraph = "```\\n${escapedReleaseNotes}\\n```"

    sh """
    curl -X POST -H 'Content-Type: application/json' \\
    -d '{
        "text": "${message}",
        "attachments": [
            {
                "pretext": "### Release Notes📋",
                "text" : "${gitGraph}"
            }
            ]
    }' ${env.MATTERMOST_WEBHOOK_URL}
    """
}

def escapeJson(String s) {
    return s
        .replace("\\", "\\\\")   // 백슬래시 먼저!
        .replace("\"", "\\\"")   // 큰따옴표 이스케이프
        .replace("\r", "")       // 캐리지 리턴 제거
        .replace("\n", "\\n")    // 줄바꿈 이스케이프
}
