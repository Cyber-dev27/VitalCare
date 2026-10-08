package com.vitalcare;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

@Entity @Table(name = "vitals")
public class Vital {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(name = "patient_id", nullable = false) private Long patientId;
    @Min(40) @Max(300) private Integer systolic;
    @Min(20) @Max(200) private Integer diastolic;
    @Min(50) @Max(100) private Integer spo2;
    @Min(20) @Max(300) @Column(name = "heart_rate") private Integer heartRate;
    @DecimalMin("30") @DecimalMax("45") private Double temperature;
    @Min(4) @Max(80) @Column(name = "resp_rate") private Integer respRate;
    @Column(name = "recorded_at") private LocalDateTime recordedAt = LocalDateTime.now();

    public Long getId() { return id; }
    public Long getPatientId() { return patientId; }
    public void setPatientId(Long v) { patientId = v; }
    public Integer getSystolic() { return systolic; }
    public void setSystolic(Integer v) { systolic = v; }
    public Integer getDiastolic() { return diastolic; }
    public void setDiastolic(Integer v) { diastolic = v; }
    public Integer getSpo2() { return spo2; }
    public void setSpo2(Integer v) { spo2 = v; }
    public Integer getHeartRate() { return heartRate; }
    public void setHeartRate(Integer v) { heartRate = v; }
    public Double getTemperature() { return temperature; }
    public void setTemperature(Double v) { temperature = v; }
    public Integer getRespRate() { return respRate; }
    public void setRespRate(Integer v) { respRate = v; }
    public LocalDateTime getRecordedAt() { return recordedAt; }
}
