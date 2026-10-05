pipeline {
    agent any

    environment {
        PATH = "C:\\Program Files\\Docker\\Docker\\resources\\bin;C:\\Program Files\\Docker\\Docker\\resources;${env.PATH}"
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Deploy Docker Stack') {
    steps {
        bat 'docker compose down --volumes --remove-orphans'
        bat 'docker rm -f vitalcare-backend vitalcare-frontend vitalcare-grafana || exit 0'
        bat 'docker compose up --build -d'
    }
}

        stage('Verify Running Containers') {
            steps {
                bat 'docker compose ps'
            }
        }
    }

    post {
        failure {
            echo 'Pipeline build failed. Jira Scrum board and backlog remain untouched.'
        }
        success {
            echo 'Pipeline deployed successfully! Backend is accessible on http://localhost:8083'
        }
    }
}