package com.crowd.auction.walletservice.service;

import com.crowd.auction.walletservice.dto.ReservedBalanceResponse;
import com.crowd.auction.walletservice.dto.TransactionDto;
import com.crowd.auction.walletservice.dto.WalletDto;
import com.crowd.auction.walletservice.model.Transaction;
import com.crowd.auction.walletservice.model.TransactionType;
import com.crowd.auction.walletservice.model.Wallet;
import com.crowd.auction.walletservice.repository.TransactionRepository;
import com.crowd.auction.walletservice.repository.WalletRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WalletService {

    private final WalletRepository walletRepository;
    private final TransactionRepository transactionRepository;

    @Transactional
    public WalletDto getOrCreateWallet(Long userId) {
        Wallet wallet = findOrCreateWalletEntity(userId);
        return mapToWalletDto(wallet);
    }

    @Transactional
    public WalletDto deposit(Long userId, BigDecimal amount, String description) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Deposit amount must be greater than zero");
        }
        Wallet wallet = findOrCreateWalletEntityWithLock(userId);
        wallet.setBalance(wallet.getBalance().add(amount));
        Wallet savedWallet = walletRepository.save(wallet);

        createTransaction(savedWallet, amount, TransactionType.DEPOSIT, 
                description != null ? description : "Deposit");

        return mapToWalletDto(savedWallet);
    }

    @Transactional
    public WalletDto withdraw(Long userId, BigDecimal amount, String description) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Withdrawal amount must be greater than zero");
        }
        Wallet wallet = findOrCreateWalletEntityWithLock(userId);
        BigDecimal availableBalance = wallet.getBalance().subtract(wallet.getReservedBalance());
        if (availableBalance.compareTo(amount) < 0) {
            throw new IllegalArgumentException("Insufficient balance for withdrawal");
        }
        wallet.setBalance(wallet.getBalance().subtract(amount));
        Wallet savedWallet = walletRepository.save(wallet);

        createTransaction(savedWallet, amount, TransactionType.WITHDRAWAL, 
                description != null ? description : "Withdrawal");

        return mapToWalletDto(savedWallet);
    }

    @Transactional
    public WalletDto reserve(Long userId, BigDecimal amount, String description) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Reservation amount must be greater than zero");
        }
        Wallet wallet = findOrCreateWalletEntityWithLock(userId);
        BigDecimal availableBalance = wallet.getBalance().subtract(wallet.getReservedBalance());
        if (availableBalance.compareTo(amount) < 0) {
            throw new IllegalArgumentException("Insufficient available balance to reserve funds");
        }
        wallet.setReservedBalance(wallet.getReservedBalance().add(amount));
        Wallet savedWallet = walletRepository.save(wallet);

        createTransaction(savedWallet, amount, TransactionType.RESERVE, 
                description != null ? description : "Reserve");

        return mapToWalletDto(savedWallet);
    }

    @Transactional
    public WalletDto release(Long userId, BigDecimal amount, String description) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Release amount must be greater than zero");
        }
        Wallet wallet = findOrCreateWalletEntityWithLock(userId);
        if (wallet.getReservedBalance().compareTo(amount) < 0) {
            throw new IllegalArgumentException("Insufficient reserved balance to release");
        }
        wallet.setReservedBalance(wallet.getReservedBalance().subtract(amount));
        Wallet savedWallet = walletRepository.save(wallet);

        createTransaction(savedWallet, amount, TransactionType.RELEASE, 
                description != null ? description : "Release");

        return mapToWalletDto(savedWallet);
    }

    @Transactional
    public WalletDto deduct(Long userId, BigDecimal amount, String description) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Deduction amount must be greater than zero");
        }
        Wallet wallet = findOrCreateWalletEntityWithLock(userId);
        if (wallet.getBalance().compareTo(amount) < 0) {
            throw new IllegalArgumentException("Insufficient balance to deduct");
        }
        if (wallet.getReservedBalance().compareTo(amount) < 0) {
            throw new IllegalArgumentException("Insufficient reserved balance to deduct");
        }
        wallet.setBalance(wallet.getBalance().subtract(amount));
        wallet.setReservedBalance(wallet.getReservedBalance().subtract(amount));
        Wallet savedWallet = walletRepository.save(wallet);

        createTransaction(savedWallet, amount, TransactionType.DEDUCT, 
                description != null ? description : "Deduct");

        return mapToWalletDto(savedWallet);
    }

    @Transactional
    public WalletDto refund(Long userId, BigDecimal amount, String description) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Refund amount must be greater than zero");
        }
        Wallet wallet = findOrCreateWalletEntityWithLock(userId);
        wallet.setBalance(wallet.getBalance().add(amount));
        Wallet savedWallet = walletRepository.save(wallet);

        createTransaction(savedWallet, amount, TransactionType.REFUND, 
                description != null ? description : "Refund");

        return mapToWalletDto(savedWallet);
    }

    @Transactional(readOnly = true)
    public ReservedBalanceResponse getReservedBalance(Long userId) {
        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseGet(() -> Wallet.builder()
                        .userId(userId)
                        .balance(BigDecimal.ZERO)
                        .reservedBalance(BigDecimal.ZERO)
                        .build());
        return ReservedBalanceResponse.builder()
                .userId(userId)
                .reservedBalance(wallet.getReservedBalance())
                .build();
    }

    @Transactional(readOnly = true)
    public List<TransactionDto> getTransactionHistory(Long userId) {
        Wallet wallet = walletRepository.findByUserId(userId).orElse(null);
        if (wallet == null) {
            return Collections.emptyList();
        }
        return transactionRepository.findByWalletIdOrderByCreatedAtDesc(wallet.getId()).stream()
                .map(this::mapToTransactionDto)
                .collect(Collectors.toList());
    }

    private Wallet findOrCreateWalletEntity(Long userId) {
        return walletRepository.findByUserId(userId)
                .orElseGet(() -> {
                    Wallet newWallet = Wallet.builder()
                            .userId(userId)
                            .balance(BigDecimal.ZERO)
                            .reservedBalance(BigDecimal.ZERO)
                            .build();
                    return walletRepository.save(newWallet);
                });
    }

    private Wallet findOrCreateWalletEntityWithLock(Long userId) {
        return walletRepository.findByUserIdWithLock(userId)
                .orElseGet(() -> {
                    Wallet newWallet = Wallet.builder()
                            .userId(userId)
                            .balance(BigDecimal.ZERO)
                            .reservedBalance(BigDecimal.ZERO)
                            .build();
                    return walletRepository.save(newWallet);
                });
    }

    private void createTransaction(Wallet wallet, BigDecimal amount, TransactionType type, String description) {
        Transaction transaction = Transaction.builder()
                .wallet(wallet)
                .amount(amount)
                .type(type)
                .description(description)
                .build();
        transactionRepository.save(transaction);
    }

    private WalletDto mapToWalletDto(Wallet wallet) {
        return WalletDto.builder()
                .id(wallet.getId())
                .userId(wallet.getUserId())
                .balance(wallet.getBalance())
                .reservedBalance(wallet.getReservedBalance())
                .build();
    }

    private TransactionDto mapToTransactionDto(Transaction transaction) {
        return TransactionDto.builder()
                .id(transaction.getId())
                .walletId(transaction.getWallet().getId())
                .amount(transaction.getAmount())
                .type(transaction.getType())
                .description(transaction.getDescription())
                .createdAt(transaction.getCreatedAt())
                .build();
    }
}
