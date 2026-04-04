package finance_tracker.controller;

import finance_tracker.dto.TransactionRequest;
import finance_tracker.model.Transaction;
import finance_tracker.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "*")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    // GET /api/transactions
    @GetMapping
    public ResponseEntity<List<Transaction>> getAllTransactions(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<Transaction> transactions = transactionService
                .getAllTransactions(userDetails.getUsername());
        return ResponseEntity.ok(transactions);
    }

    // GET /api/transactions/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Transaction> getTransactionById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        Transaction transaction = transactionService
                .getTransactionById(id, userDetails.getUsername());
        return ResponseEntity.ok(transaction);
    }

    // POST /api/transactions
    @PostMapping
    public ResponseEntity<Transaction> createTransaction(
            @Valid @RequestBody TransactionRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        Transaction transaction = transactionService
                .createTransaction(request, userDetails.getUsername());
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(transaction);
    }

    // PUT /api/transactions/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Transaction> updateTransaction(
            @PathVariable Long id,
            @Valid @RequestBody TransactionRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        Transaction transaction = transactionService
                .updateTransaction(id, request,
                        userDetails.getUsername());
        return ResponseEntity.ok(transaction);
    }

    // DELETE /api/transactions/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        transactionService.deleteTransaction(
                id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }

    // GET /api/transactions/type/{type}
    @GetMapping("/type/{type}")
    public ResponseEntity<List<Transaction>> getByType(
            @PathVariable String type,
            @AuthenticationPrincipal UserDetails userDetails) {
        List<Transaction> transactions = transactionService
                .getTransactionsByType(type,
                        userDetails.getUsername());
        return ResponseEntity.ok(transactions);
    }

    // GET /api/transactions/category/{category}
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Transaction>> getByCategory(
            @PathVariable String category,
            @AuthenticationPrincipal UserDetails userDetails) {
        List<Transaction> transactions = transactionService
                .getTransactionsByCategory(category,
                        userDetails.getUsername());
        return ResponseEntity.ok(transactions);
    }

    // GET /api/transactions/date-range?startDate=&endDate=
    @GetMapping("/date-range")
    public ResponseEntity<List<Transaction>> getByDateRange(
            @RequestParam // Converting string "2026-03-01" into a LocalDate object.
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate startDate,
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate endDate,
            @AuthenticationPrincipal UserDetails userDetails) {
        List<Transaction> transactions = transactionService
                .getTransactionsByDateRange(startDate, endDate,
                        userDetails.getUsername());
        return ResponseEntity.ok(transactions);
    }

    // GET /api/transactions/dashboard
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard(
            @AuthenticationPrincipal UserDetails userDetails) {
        Map<String, Object> summary = transactionService
                .getDashboardSummary(userDetails.getUsername());
        return ResponseEntity.ok(summary);
    }
}
