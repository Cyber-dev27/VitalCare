pipeline {
    agent any

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Build Backend') {
            steps {
                dir('backend') {
                    // Compiles the Spring Boot app using Maven Wrapper
                    bat 'mvnw.cmd clean package -DskipTests'
                }
            }
        }

        stage('Deploy Docker Stack') {
            steps {
                // Rebuilds containers and starts services (Backend mapped to port 8083)
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