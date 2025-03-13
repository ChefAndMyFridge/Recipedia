pipeline {
    agent any  // 어떤 Jenkins 에이전트에서도 실행 가능

    environment {
        APP_NAME = ""      
    }

    stages {
        stage('git repository pull, sourcecode update') {
            steps {
                cleanWs()  // Jenkins 작업 공간을 완전히 초기화
                git branch: 'deploy', credentialsId: 'my-gitlab-token', url: 'https://lab.ssafy.com/s12-s-project/S12P21S003.git'
            }
        }

        stage('Copy .env to Jenkins Container') {
            steps {
                script {
                    sh '''
                    ssh -i /root/.ssh/id_rsa ubuntu@j12s003.p.ssafy.io \
                        "docker cp /home/ubuntu/S12P21S003/.env my-jenkins:/var/jenkins_home/workspace/recipedia/.env && \
                        docker cp /home/ubuntu/S12P21S003/backend/.env my-jenkins:/var/jenkins_home/workspace/recipedia/backend/.env && \
                        docker cp /home/ubuntu/S12P21S003/frontend/.env my-jenkins:/var/jenkins_home/workspace/recipedia/frontend/.env && \
                        docker cp /home/ubuntu/S12P21S003/ai/.env my-jenkins:/var/jenkins_home/workspace/recipedia/ai/.env"
                    '''
                }
            }
        }

        stage('Stop & Remove Old App Containers') {
            steps {
                script {
                    sh '''
                    cd $WORKSPACE
                    docker-compose -f docker-compose-app.yml down
                    '''
                    // cd /var/jenkins_home/workspace/recipedia
                }
            }
        }

        stage('Build & Start New App Containers') {
            steps {
                script {
                    sh '''
                    cd $WORKSPACE
                    docker-compose -f docker-compose-app.yml up -d --build
                    '''
                    // cd /var/jenkins_home/workspace/recipedia
                }
            }
        }
    }
}
