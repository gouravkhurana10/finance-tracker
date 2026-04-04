package finance_tracker.dto;

public class AuthResponse {

    private String token;
    private String email;
    private String name;
    private String message;

    public AuthResponse(String token, String email,
                        String name, String message) {
        this.token = token;
        this.email = email;
        this.name = name;
        this.message = message;
    }

    // Getters
    public String getToken() { return token; }
    public String getEmail() { return email; }
    public String getName() { return name; }
    public String getMessage() { return message; }
}