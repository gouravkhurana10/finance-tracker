package finance_tracker.repository;

import finance_tracker.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    // Get all transactions for a specific user
    List<Transaction> findByUserId(Long userId);

    // Get transactions by type for a specific user
    List<Transaction> findByUserIdAndType(Long userId, String type);

    // Get transactions by category for a specific user
    List<Transaction> findByUserIdAndCategory(Long userId, String category);

    // Get transactions within a date range for a specific user
    List<Transaction> findByUserIdAndTransactionDateBetween(
            Long userId, LocalDate startDate, LocalDate endDate);

    // Calculate total amount by type for a specific user
    // COALESCE(..., 0) returns 0 instead of null if no transactions exist
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t " +
            "WHERE t.user.id = :userId AND t.type = :type")
    BigDecimal sumAmountByUserIdAndType(Long userId, String type);

    // Get transactions by type and category
    List<Transaction> findByUserIdAndTypeAndCategory(
            Long userId, String type, String category);
}