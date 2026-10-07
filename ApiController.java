package com.vitalcare;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@RestController @RequestMapping("/api")
public class ApiController {
    private final PatientRepo patients;
    private final VitalRepo vitals;
    ApiController(PatientRepo p, VitalRepo v) { patients = p; vitals = v; }

    @GetMapping("/patients")
    List<Patient> list(@RequestParam(required = false) String q) {
        return (q == null || q.isBlank()) ? patients.findAll() : patients.findByNameContainingIgnoreCase(q);
    }

    @GetMapping("/patients/{id}")
    Patient get(@PathVariable Long id) {
        return patients.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    @PostMapping("/patients") @ResponseStatus(HttpStatus.CREATED)
    Patient create(@Valid @RequestBody Patient p) { return patients.save(p); }

    @PutMapping("/patients/{id}")
    Patient update(@PathVariable Long id, @Valid @RequestBody Patient in) {
        Patient p = get(id);
        p.setName(in.getName()); p.setAge(in.getAge()); p.setGender(in.getGender());
        p.setPhone(in.getPhone()); p.setConditionNotes(in.getConditionNotes());
        return patients.save(p);
    }

    @DeleteMapping("/patients/{id}") @ResponseStatus(HttpStatus.NO_CONTENT)
    void delete(@PathVariable Long id) { patients.deleteById(id); }

    @GetMapping("/patients/{id}/vitals")
    List<Vital> history(@PathVariable Long id) { return vitals.findTop100ByPatientIdOrderByRecordedAtDesc(id); }

    @PostMapping("/patients/{id}/vitals") @ResponseStatus(HttpStatus.CREATED)
    Vital record(@PathVariable Long id, @Valid @RequestBody Vital v) {
        get(id);
        v.setPatientId(id);
        return vitals.save(v);
    }

    @GetMapping("/vitals/latest")
    List<Vital> latest() { return vitals.findLatestPerPatient(); }
}
