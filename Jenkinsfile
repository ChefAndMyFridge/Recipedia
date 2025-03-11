pipeline {
    agent any  // 어떤 Jenkins 에이전트에서도 실행 가능

    // environment {
    //     COMPOSE_FILE = "docker-compose.yml"
    // }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'deploy', credentialsId: 'my-gitlab-token', url: 'https://lab.ssafy.com/s12-s-project/S12P21S003.git'
            }
        }

        stage('Stop & Remove Old Containers') {
            steps {
                script {
                    sh 'docker-compose down' // 기존 컨테이너 종료
                }
            }
        }

        stage('Build & Start New Containers') {
            steps {
                script {
                    sh 'docker-compose up -d --build' // 새 컨테이너 빌드 & 실행
                }
            }
        }

        stage('Check Running Containers') {
            steps {
                script {
                    sh 'docker ps -a' // 실행 중인 컨테이너 확인
                }
            }
        }
    }
}
