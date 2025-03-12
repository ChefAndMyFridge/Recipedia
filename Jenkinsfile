pipeline {
    agent any  // 어떤 Jenkins 에이전트에서도 실행 가능

    environment {
        APP_NAME = ""      
    }

    stages {
        // stage('Load Environment Variables') {
        //     steps {
        //         script {
        //             def envVars = readFile('.env').split("\n").findAll { it.trim() }
        //             for (line in envVars) {
        //                 def parts = line.split("=")
        //                 if (parts.length == 2) {
        //                     env[parts[0].trim()] = parts[1].trim()
        //                 }
        //             }
        //         }
        //     }
        // }

        stage('git repository pull, sourcecode update') {
            steps {
                // script {
                //     sh '''
                //     if [ -d .git ]; then
                //         git reset --hard  # 기존 변경사항 초기화
                //         git pull origin deploy
                //     else
                //         git clone -b deploy https://lab.ssafy.com/s12-s-project/S12P21S003.git .
                //     fi
                //     '''
                // }
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
                    // withEnv(["APP_NAME=${env.APP_NAME}"]) {
                    // }
                    // sh 'cd $WORKSPACE && docker-compose -f docker-compose-app.yml down' // 기존 컨테이너 종료
                    // sh 'while [ $(docker-compose ps -q | wc -l) -ne 0 ]; do sleep 3; done' // 컨테이너 완전 종료될 때까지 대기
                }
            }
        }

        stage('Build & Start New App Containers') {
            steps {
                script {
                    sh '''
                    cd /var/jenkins_home/workspace/recipedia
                    docker-compose -f docker-compose-app.yml up -d --build // 새 컨테이너 빌드 & 실행
                    '''
                }
            }
        }

        // stage('Check Running Containers') {
        //     steps {
        //         script {
        //             sh 'cd $WORKSPACE && docker ps -a' // 실행 중인 컨테이너 확인
        //         }
        //     }
        // }
    }
}
