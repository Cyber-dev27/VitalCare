pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        stage('Build App') {
            steps {
                sh 'npm run build'
            }
        }
    }
}
// Hello, this is a Jenkins pipeline script that defines a simple CI/CD process for a Node.js application. It consists of three stages: Checkout, Install Dependencies, and Build App.
