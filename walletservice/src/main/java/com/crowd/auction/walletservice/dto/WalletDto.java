package com.crowd.auction.walletservice.dto;

import lombok.*;
import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class WalletDto {
    private Long id;
    private Long userId;
    private BigDecimal balance;
    private BigDecimal reservedBalance;
}
