pipeline {
  agent any

   environment {
    COMPOSE_PROJECT_NAME = 'vitalcare'
  }

  options {
    timestamps()
    disableConcurrentBuilds()
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Build images') {
      steps {
        withCredentials([string(credentialsId: 'vitalcare-db-password', variable: 'DB_PASSWORD')]) {
          bat 'docker compose build'
        }
      }
    }

    stage('Deploy') {
      steps {
        withCredentials([string(credentialsId: 'vitalcare-db-password', variable: 'DB_PASSWORD')]) {
          // No --volumes: keeps patient data between deployments
          bat 'docker compose up -d --remove-orphans'
        }
      }
    }

    stage('Smoke test') {
      steps {
        powershell '''
          $ok = $false
          for ($i = 0; $i -lt 30; $i++) {
            try {
              Invoke-WebRequest -UseBasicParsing http://localhost:8083/api/patients | Out-Null
              $ok = $true; break
            } catch { Start-Sleep -Seconds 5 }
          }
          if (-not $ok) { docker compose logs --tail=50 backend; exit 1 }
          Write-Host "VitalCare API is up"
        '''
      }
    }
  }

  post {
    success { echo 'Deployed. Open http://localhost (or your FRONTEND_PORT).' }
    failure { echo 'Build failed. Read the first error above this line.' }
  }
}
