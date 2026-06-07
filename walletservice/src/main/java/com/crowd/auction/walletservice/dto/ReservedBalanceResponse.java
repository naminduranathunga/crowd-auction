package com.crowd.auction.walletservice.dto;

import lombok.*;
import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReservedBalanceResponse {
    private Long userId;
    private BigDecimal reservedBalance;
}
