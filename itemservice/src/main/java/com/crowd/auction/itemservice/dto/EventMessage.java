package com.crowd.auction.itemservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventMessage<T> {
    private String eventType;
    private T payload;
}
