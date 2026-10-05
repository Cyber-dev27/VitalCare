pipeline {
    agent any

    environment {
        // AppData path found via 'where docker'
        DOCKER_BIN = 'C:\\Users\\yogini bhatia\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin\\docker.exe'
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Deploy Docker Stack') {
            steps {
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