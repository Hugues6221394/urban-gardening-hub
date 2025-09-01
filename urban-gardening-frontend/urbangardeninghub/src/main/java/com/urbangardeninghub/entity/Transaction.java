package com.urbangardeninghub.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "buyer_id")
    private User buyer;

    @ManyToOne
    @JoinColumn(name = "seller_id")
    private User seller;

    @ManyToOne
    @JoinColumn(name = "listing_id")
    private Marketplace listing;

    private Double quantity;
    private BigDecimal unitPrice;
    private BigDecimal totalAmount;
    private BigDecimal platformCommission;

    @Enumerated(EnumType.STRING)
    private TransactionStatus status;

    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;

    private String transactionReference;

    @CreatedDate
    private LocalDateTime createdAt;

    public enum TransactionStatus {
        PENDING, COMPLETED, CANCELLED, REFUNDED
    }

    public enum PaymentMethod {
        MOBILE_MONEY, BANK_TRANSFER, CASH, CARD
    }
}