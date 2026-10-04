package com.vitalcare;

import org.springframework.data.jpa.repository.*;
import java.util.List;

interface PatientRepo extends JpaRepository<Patient, Long> {
    List<Patient> findByNameContainingIgnoreCase(String name);
}

interface VitalRepo extends JpaRepository<Vital, Long> {
    List<Vital> findTop100ByPatientIdOrderByRecordedAtDesc(Long patientId);

    @Query("select v from Vital v where v.recordedAt = " +
           "(select max(x.recordedAt) from Vital x where x.patientId = v.patientId)")
    List<Vital> findLatestPerPatient();
}
