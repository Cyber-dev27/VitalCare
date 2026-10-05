pipeline {
    agent any

    environment {
        // Includes both Docker Desktop bin and cli-plugins in the PATH
        PATH = "C:\\Users\\yogini bhatia\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin;C:\\Users\\yogini bhatia\\AppData\\Local\\Programs\\DockerDesktop\\resources\\cli-plugins;${env.PATH}"
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Deploy Docker Stack') {
            steps {
                bat 'docker compose down'
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