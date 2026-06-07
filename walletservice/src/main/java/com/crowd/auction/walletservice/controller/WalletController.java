package com.crowd.auction.walletservice.controller;

import com.crowd.auction.walletservice.dto.ReservedBalanceResponse;
import com.crowd.auction.walletservice.dto.TransactionDto;
import com.crowd.auction.walletservice.dto.TransactionRequest;
import com.crowd.auction.walletservice.dto.WalletDto;
import com.crowd.auction.walletservice.service.WalletService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(WalletController.API_BASE_URL)
@RequiredArgsConstructor
public class WalletController {

    public static final String API_BASE_URL = "/api/v1/wallets";

    private final WalletService walletService;

    @GetMapping("/{userId}")
    public ResponseEntity<WalletDto> getWalletDetails(@PathVariable Long userId) {
        return ResponseEntity.ok(walletService.getOrCreateWallet(userId));
    }

    @PostMapping("/{userId}/deposit")
    public ResponseEntity<WalletDto> deposit(
            @PathVariable Long userId,
            @Valid @RequestBody TransactionRequest request
    ) {
        return ResponseEntity.ok(walletService.deposit(userId, request.getAmount(), request.getDescription()));
    }

    @PostMapping("/{userId}/withdraw")
    public ResponseEntity<WalletDto> withdraw(
            @PathVariable Long userId,
            @Valid @RequestBody TransactionRequest request
    ) {
        return ResponseEntity.ok(walletService.withdraw(userId, request.getAmount(), request.getDescription()));
    }

    @GetMapping("/{userId}/transactions")
    public ResponseEntity<List<TransactionDto>> getTransactionHistory(@PathVariable Long userId) {
        return ResponseEntity.ok(walletService.getTransactionHistory(userId));
    }

    @PostMapping("/{userId}/reserve")
    public ResponseEntity<WalletDto> reserve(
            @PathVariable Long userId,
            @Valid @RequestBody TransactionRequest request
    ) {
        return ResponseEntity.ok(walletService.reserve(userId, request.getAmount(), request.getDescription()));
    }

    @PostMapping("/{userId}/release")
    public ResponseEntity<WalletDto> release(
            @PathVariable Long userId,
            @Valid @RequestBody TransactionRequest request
    ) {
        return ResponseEntity.ok(walletService.release(userId, request.getAmount(), request.getDescription()));
    }

    @PostMapping("/{userId}/deduct")
    public ResponseEntity<WalletDto> deduct(
            @PathVariable Long userId,
            @Valid @RequestBody TransactionRequest request
    ) {
        return ResponseEntity.ok(walletService.deduct(userId, request.getAmount(), request.getDescription()));
    }

    @PostMapping("/{userId}/refund")
    public ResponseEntity<WalletDto> refund(
            @PathVariable Long userId,
            @Valid @RequestBody TransactionRequest request
    ) {
        return ResponseEntity.ok(walletService.refund(userId, request.getAmount(), request.getDescription()));
    }

    @GetMapping("/{userId}/reserved-balance")
    public ResponseEntity<ReservedBalanceResponse> getReservedBalance(@PathVariable Long userId) {
        return ResponseEntity.ok(walletService.getReservedBalance(userId));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgument(IllegalArgumentException e) {
        return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
    }
}
