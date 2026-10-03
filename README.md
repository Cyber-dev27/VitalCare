# VitalCare – Patient Vitals Monitoring
React (Vite) + Spring Boot (Java 17) + MySQL

## 1. Database
    mysql -u root -p < database/schema.sql
## 2. Backend (http://localhost:8080)
Edit DB password in backend/src/main/resources/application.properties, then:
    cd backend && mvn spring-boot:run
## 3. Frontend (http://localhost:5173)
    cd frontend && npm install && npm run dev

API: GET/POST /api/patients, GET/PUT/DELETE /api/patients/{id},
GET/POST /api/patients/{id}/vitals, GET /api/vitals/latest
