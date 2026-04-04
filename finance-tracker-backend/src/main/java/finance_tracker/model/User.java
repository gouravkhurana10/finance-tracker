package finance_tracker.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Entity // @Entity tells Spring that this Java class maps to a database table.
@Table(name = "users") // It names the table "users" in MySQL. Spring will automatically create this table when the application runs.
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // @NotBlank and @Email are validation annotations. It prevents bad data from ever reaching the database.
    // @NotBlank — the field cannot be empty or null
    @NotBlank
    @Column(nullable = false)
    private String name;

    @Email // @Email — the email must be in valid format (e.g. name@example.com)
    @NotBlank
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank
    @Column(nullable = false)
    private String password;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Automatically sets the createdAt timestamp the moment a new user registers. No manual date entry needed.
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    /* Passwords are stored as plain String. However, through Spring Security dependency, password will be encrypted
     using BCrypt before saving it. So, even if someone accessed the database directly they would never see real passwords.
     */
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}