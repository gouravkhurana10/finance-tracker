package finance_tracker.repository;

import finance_tracker.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Find user by email - used for login
    // Using Optional will prevent NullPointerException
    Optional<User> findByEmail(String email);

    // Check if email already exists - used for registration
    Boolean existsByEmail(String email);
}