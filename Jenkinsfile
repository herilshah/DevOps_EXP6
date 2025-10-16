pipeline {
  agent any
  environment {
    USER_IMAGE = "herilshah/user-service"
    ORDER_IMAGE = "herilshah/order-service"
    // Use the credential ID you added in Jenkins (username/password)
    DOCKER_CREDENTIALS = "dockerhub"
  }
  stages {
    stage('Clone') {
      steps {
        echo "Assumes Jenkins job checks out the repository (multibranch or pipeline)"
        checkout scm
      }
    }
    stage('Build Services') {
      steps {
        dir('user-service') {
          sh 'npm install --silent'
          sh 'npm test || true'
        }
        dir('order-service') {
          sh 'npm install --silent'
          sh 'npm test || true'
        }
      }
    }
    stage('Build Docker Images') {
      steps {
        script {
          sh 'docker build -t ${USER_IMAGE}:latest ./user-service'
          sh 'docker build -t ${ORDER_IMAGE}:latest ./order-service'
        }
      }
    }
    stage('Docker Login & Push') {
      steps {
        withCredentials([usernamePassword(credentialsId: env.DOCKER_CREDENTIALS, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'
          sh 'docker push ${USER_IMAGE}:latest'
          sh 'docker push ${ORDER_IMAGE}:latest'
        }
      }
    }
    stage('Deploy (local)') {
      steps {
        echo "Stops any existing containers and runs new ones (requires Docker on Jenkins machine)"
        sh 'docker rm -f user-service || true'
        sh 'docker rm -f order-service || true'
        sh 'docker run -d --name user-service -p 5001:5001 ${USER_IMAGE}:latest'
        sh 'docker run -d --name order-service -p 5002:5002 ${ORDER_IMAGE}:latest'
      }
    }
  }
  post {
    always {
      echo "Pipeline finished"
    }
  }
}
