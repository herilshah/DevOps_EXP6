pipeline {
    agent any

    environment {
        PATH = "/opt/homebrew/bin:/usr/local/bin:${env.PATH}"  // Node & Docker
        DOCKERHUB_CREDENTIALS = 'dockerhub'                  // Jenkins Docker Hub credentials ID
        DOCKERHUB_USERNAME = 'herilshah'                     // Your Docker Hub username
    }

    stages {
        stage('Check Tools') {
            steps {
                sh 'node -v'
                sh 'npm -v'
                sh 'docker --version'
            }
        }

        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/herilshah/DevOps_EXP6.git',
                    credentialsId: 'github'  // your GitHub credentials ID
            }
        }

        stage('Build Services') {
            parallel {
                stage('Build User Service') {
                    steps {
                        dir('user-service') {
                            sh '/opt/homebrew/bin/npm install --silent'
                        }
                    }
                }
                stage('Build Order Service') {
                    steps {
                        dir('order-service') {
                            sh '/opt/homebrew/bin/npm install --silent'
                        }
                    }
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                sh 'docker build -t $DOCKERHUB_USERNAME/user-service ./user-service'
                sh 'docker build -t $DOCKERHUB_USERNAME/order-service ./order-service'
            }
        }

        stage('Docker Login & Push') {
            steps {
                withCredentials([usernamePassword(credentialsId: "$DOCKERHUB_CREDENTIALS",
                                                  usernameVariable: 'DOCKER_USER',
                                                  passwordVariable: 'DOCKER_PASS')]) {
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                    sh 'docker push $DOCKERHUB_USERNAME/user-service'
                    sh 'docker push $DOCKERHUB_USERNAME/order-service'
                }
            }
        }

        stage('Deploy Containers Locally') {
            steps {
                // Stop & remove any existing containers
                sh 'docker stop user-service || true'
                sh 'docker rm user-service || true'
                sh 'docker stop order-service || true'
                sh 'docker rm order-service || true'

                // Run containers
                sh 'docker run -d --name user-service -p 5001:5001 $DOCKERHUB_USERNAME/user-service'
                sh 'docker run -d --name order-service -p 5002:5002 $DOCKERHUB_USERNAME/order-service'
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully! Services are running on ports 5001 & 5002.'
        }
        failure {
            echo 'Pipeline failed! Check console output for errors.'
        }
    }
}
