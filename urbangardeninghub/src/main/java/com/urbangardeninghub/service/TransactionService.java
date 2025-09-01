package com.urbangardeninghub.service;

import com.urbangardeninghub.entity.Marketplace;
import com.urbangardeninghub.entity.Transaction;
import com.urbangardeninghub.entity.User;
import com.urbangardeninghub.repository.MarketplaceRepository;
import com.urbangardeninghub.repository.TransactionRepository;
import com.urbangardeninghub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class TransactionService {
    private final TransactionRepository transactionRepository;
    private final MarketplaceRepository marketplaceRepository;
    private final UserRepository userRepository;

    public Transaction createTransaction(Long listingId, Double quantity, Long buyerId, Transaction.PaymentMethod paymentMethod) {
        Marketplace listing = marketplaceRepository.findById(listingId)
                .orElseThrow(() -> new RuntimeException("Listing not found"));
        User buyer = userRepository.findById(buyerId)
                .orElseThrow(() -> new RuntimeException("Buyer not found"));

        // Validate quantity
        if (quantity > listing.getQuantity()) {
            throw new RuntimeException("Requested quantity exceeds available quantity");
        }

        // Calculate amounts
        BigDecimal unitPrice = listing.getPricePerUnit();
        BigDecimal totalAmount = unitPrice.multiply(BigDecimal.valueOf(quantity));
        BigDecimal platformCommission = totalAmount.multiply(BigDecimal.valueOf(0.05)); // 5% commission

        // Create transaction
        Transaction transaction = Transaction.builder()
                .buyer(buyer)
                .seller(listing.getSeller())
                .listing(listing)
                .quantity(quantity)
                .unitPrice(unitPrice)
                .totalAmount(totalAmount)
                .platformCommission(platformCommission)
                .paymentMethod(paymentMethod)
                .status(Transaction.TransactionStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();

        // Update listing quantity
        listing.setQuantity(listing.getQuantity() - quantity);
        if (listing.getQuantity() <= 0) {
            listing.setStatus(Marketplace.ListingStatus.SOLD);
        }
        marketplaceRepository.save(listing);

        return transactionRepository.save(transaction);
    }

    public Transaction updateTransactionStatus(Long transactionId, Transaction.TransactionStatus status) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        transaction.setStatus(status);
        return transactionRepository.save(transaction);
    }

    public void processRefund(Long transactionId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        if (transaction.getStatus() != Transaction.TransactionStatus.COMPLETED) {
            throw new RuntimeException("Only completed transactions can be refunded");
        }

        // Restore listing quantity
        Marketplace listing = transaction.getListing();
        listing.setQuantity(listing.getQuantity() + transaction.getQuantity());
        if (listing.getStatus() == Marketplace.ListingStatus.SOLD) {
            listing.setStatus(Marketplace.ListingStatus.ACTIVE);
        }
        marketplaceRepository.save(listing);

        // Update transaction status
        transaction.setStatus(Transaction.TransactionStatus.REFUNDED);
        transactionRepository.save(transaction);
    }
}