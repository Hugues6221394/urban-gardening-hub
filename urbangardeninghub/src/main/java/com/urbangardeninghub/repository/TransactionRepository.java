package com.urbangardeninghub.repository;

import com.urbangardeninghub.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByBuyerId(Long buyerId);
    List<Transaction> findBySellerId(Long sellerId);
    List<Transaction> findByStatus(Transaction.TransactionStatus status);

    long countByBuyerId(Long buyerId);
    long countBySellerId(Long sellerId);

    @Query("SELECT COALESCE(SUM(t.totalAmount), 0) FROM Transaction t WHERE t.buyer.id = :buyerId")
    Double sumTotalAmountByBuyerId(@Param("buyerId") Long buyerId);

    @Query("SELECT COALESCE(SUM(t.totalAmount), 0) FROM Transaction t WHERE t.seller.id = :sellerId")
    Double sumTotalAmountBySellerId(@Param("sellerId") Long sellerId);

    @Query("SELECT COALESCE(SUM(t.platformCommission), 0) FROM Transaction t")
    Double sumPlatformCommission();

    List<Transaction> findTop5ByBuyerIdOrderByCreatedAtDesc(Long buyerId);
    List<Transaction> findTop5BySellerIdOrderByCreatedAtDesc(Long sellerId);

    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.buyer.id = :buyerId AND t.listing.isLocallyGrown = true")
    Long countLocalPurchases(@Param("buyerId") Long buyerId);
}