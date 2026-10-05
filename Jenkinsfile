pipeline {
    agent any

    environment {
        // Absolute path to Docker Desktop executable on Windows
        DOCKER_BIN = 'C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe'
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Deploy Docker Stack') {
            steps {
                // Uses full path to docker.exe to avoid PATH issues
                bat '"%DOCKER_BIN%" compose down'
                bat '"%DOCKER_BIN%" compose up --build -d'
            }
        }

        stage('Verify Running Containers') {
            steps {
                bat '"%DOCKER_BIN%" compose ps'
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