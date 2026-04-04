package finance_tracker.service;

import finance_tracker.dto.TransactionRequest;
import finance_tracker.exception.ResourceNotFoundException;
import finance_tracker.model.Transaction;
import finance_tracker.model.User;
import finance_tracker.repository.TransactionRepository;
import finance_tracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

    // Helper — get user by email
    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found with email: " + email));
    }

    // Get all transactions for logged in user
    public List<Transaction> getAllTransactions(String email) {
        User user = getUserByEmail(email);
        return transactionRepository.findByUserId(user.getId());
    }

    // Get transaction by ID
    public Transaction getTransactionById(Long id, String email) {
        User user = getUserByEmail(email);
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Transaction not found with id: " + id));

        // Ensure transaction belongs to logged in user
        if (!transaction.getUser().getId().equals(user.getId())) {
            throw new RuntimeException(
                    "Access denied to this transaction");
        }
        return transaction;
    }

    // Create a new transaction
    public Transaction createTransaction(TransactionRequest request,
                                         String email) {
        User user = getUserByEmail(email);

        Transaction transaction = new Transaction();
        transaction.setTitle(request.getTitle());
        transaction.setDescription(request.getDescription());
        transaction.setAmount(request.getAmount());
        transaction.setType(request.getType().toUpperCase());
        transaction.setCategory(request.getCategory());
        transaction.setTransactionDate(request.getTransactionDate());
        transaction.setUser(user);

        return transactionRepository.save(transaction);
    }

    // Update an existing transaction
    public Transaction updateTransaction(Long id,
                                         TransactionRequest request,
                                         String email) {
        Transaction transaction = getTransactionById(id, email);

        transaction.setTitle(request.getTitle());
        transaction.setDescription(request.getDescription());
        transaction.setAmount(request.getAmount());
        transaction.setType(request.getType().toUpperCase());
        transaction.setCategory(request.getCategory());
        transaction.setTransactionDate(request.getTransactionDate());

        return transactionRepository.save(transaction);
    }

    // Delete a transaction
    public void deleteTransaction(Long id, String email) {
        Transaction transaction = getTransactionById(id, email);
        transactionRepository.delete(transaction);
    }

    // Get transactions by type
    public List<Transaction> getTransactionsByType(String type,
                                                   String email) {
        User user = getUserByEmail(email);
        return transactionRepository.findByUserIdAndType(
                user.getId(), type.toUpperCase());
    }

    // Get transactions by category
    public List<Transaction> getTransactionsByCategory(String category,
                                                       String email) {
        User user = getUserByEmail(email);
        return transactionRepository.findByUserIdAndCategory(
                user.getId(), category);
    }

    // Get transactions by date range
    public List<Transaction> getTransactionsByDateRange(
            LocalDate startDate, LocalDate endDate, String email) {
        User user = getUserByEmail(email);
        return transactionRepository
                .findByUserIdAndTransactionDateBetween(
                        user.getId(), startDate, endDate);
    }

    // Get dashboard summary
    public Map<String, Object> getDashboardSummary(String email) {
        User user = getUserByEmail(email);
        Long userId = user.getId();

        BigDecimal totalIncome = transactionRepository
                .sumAmountByUserIdAndType(userId, "INCOME");
        BigDecimal totalExpenses = transactionRepository
                .sumAmountByUserIdAndType(userId, "EXPENSE");
        BigDecimal balance = totalIncome.subtract(totalExpenses);

        List<Transaction> recentTransactions = transactionRepository
                .findByUserId(userId)
                .stream()
                .sorted((a, b) -> b.getCreatedAt()
                        .compareTo(a.getCreatedAt()))
                .limit(5)
                .toList();

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalIncome", totalIncome);
        summary.put("totalExpenses", totalExpenses);
        summary.put("balance", balance);
        summary.put("recentTransactions", recentTransactions);

        return summary;
    }
}