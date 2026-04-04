package finance_tracker.service;

import finance_tracker.dto.AuthResponse;
import finance_tracker.dto.LoginRequest;
import finance_tracker.dto.RegisterRequest;
import finance_tracker.model.User;
import finance_tracker.repository.UserRepository;
import finance_tracker.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    // Register a new user
    public AuthResponse register(RegisterRequest request) {

        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException(
                    "Email already registered: " + request.getEmail());
        }

        // Create new user
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        // Save to database
        userRepository.save(user);

        // Generate JWT token
        String token = jwtUtils.generateToken(request.getEmail());

        return new AuthResponse(
                token,
                user.getEmail(),
                user.getName(),
                "Registration successful"
        );
    }

    // Login existing user
    public AuthResponse login(LoginRequest request) {

        // Authenticate using Spring Security
        Authentication authentication;
        try {
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
        } catch (Exception e) {
            throw new RuntimeException("Invalid email or password");
        }

        // Set authentication in security context
        SecurityContextHolder.getContext()
                .setAuthentication(authentication);

        // Get user details
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException(
                        "User not found"));

        // Generate JWT token
        String token = jwtUtils.generateToken(request.getEmail());

        return new AuthResponse(
                token,
                user.getEmail(),
                user.getName(),
                "Login successful"
        );
    }
}