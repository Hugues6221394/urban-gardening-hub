package com.urbangardeninghub.controller;

import com.urbangardeninghub.config.UserPrincipal;
import com.urbangardeninghub.entity.Transaction;
import com.urbangardeninghub.repository.TransactionRepository;
import com.urbangardeninghub.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {
    private final TransactionService transactionService;
    private final TransactionRepository transactionRepository;

    @PostMapping
    public ResponseEntity<Transaction> createTransaction(
            @RequestParam Long listingId,
            @RequestParam Double quantity,
            @RequestParam Transaction.PaymentMethod paymentMethod,
            Authentication authentication) {

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Transaction transaction = transactionService.createTransaction(
                listingId, quantity, userPrincipal.getId(), paymentMethod);

        return ResponseEntity.ok(transaction);
    }

    @GetMapping("/my-purchases")
    public ResponseEntity<List<Transaction>> getMyPurchases(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        List<Transaction> transactions = transactionRepository.findByBuyerId(userPrincipal.getId());
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/my-sales")
    public ResponseEntity<List<Transaction>> getMySales(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        List<Transaction> transactions = transactionRepository.findBySellerId(userPrincipal.getId());
        return ResponseEntity.ok(transactions);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Transaction> updateTransactionStatus(
            @PathVariable Long id,
            @RequestParam Transaction.TransactionStatus status) {

        Transaction transaction = transactionService.updateTransactionStatus(id, status);
        return ResponseEntity.ok(transaction);
    }

    @PostMapping("/{id}/refund")
    public ResponseEntity<?> processRefund(@PathVariable Long id) {
        transactionService.processRefund(id);
        return ResponseEntity.ok().build();
    }
}