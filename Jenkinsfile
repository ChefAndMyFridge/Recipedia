pipeline {
    agent any  // 어떤 Jenkins 에이전트에서도 실행 가능

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

        stage('Copy .env to Jenkins Container') {
            steps {
                script {
                    sh """
                    ssh -i /root/.ssh/id_rsa ubuntu@j12s003.p.ssafy.io \\
                        "docker cp /home/ubuntu/S12P21S003/.env my-jenkins:${env.WORKSPACE}/.env && \\
                        docker cp /home/ubuntu/S12P21S003/backend/.env my-jenkins:${env.WORKSPACE}/backend/.env && \\
                        docker cp /home/ubuntu/S12P21S003/frontend/.env my-jenkins:${env.WORKSPACE}/frontend/.env && \\
                        docker cp /home/ubuntu/S12P21S003/ai/.env my-jenkins:${env.WORKSPACE}/ai/.env"
                    """
                }
            }
        }

        stage('Stop & Remove Old App Containers') {
            steps {
                script {
                    sh """
                    cd ${env.WORKSPACE}
                    docker-compose -f docker-compose-app.yml down
                    """
                }
            }
        }

        stage('Build & Start New App Containers') {
            steps {
                script {
                    sh """
                    cd ${env.WORKSPACE}
                    docker-compose -f docker-compose-app.yml up -d --build
                    """
                }
            }
        }
    }
}
