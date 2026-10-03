package com.vitalcare;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

@Entity @Table(name = "patients")
public class Patient {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @NotBlank private String name;
    @Min(0) @Max(130) private int age;
    private String gender;
    private String phone;
    @Column(name = "condition_notes", length = 500) private String conditionNotes;
    @Column(name = "created_at", updatable = false) private LocalDateTime createdAt = LocalDateTime.now();

    public Long getId() { return id; }
    public String getName() { return name; }
    public void setName(String v) { name = v; }
    public int getAge() { return age; }
    public void setAge(int v) { age = v; }
    public String getGender() { return gender; }
    public void setGender(String v) { gender = v; }
    public String getPhone() { return phone; }
    public void setPhone(String v) { phone = v; }
    public String getConditionNotes() { return conditionNotes; }
    public void setConditionNotes(String v) { conditionNotes = v; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
