package com.crowd.auction.itemservice.controller;

import com.crowd.auction.itemservice.dto.AuctionResponseDTO;
import com.crowd.auction.itemservice.service.AuctionService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuctionController.class)
public class AuctionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuctionService auctionService;

    @Test
    void getAllAuctions_Success() throws Exception {
        AuctionResponseDTO auction = AuctionResponseDTO.builder()
                .id(1L)
                .name("Test Auction")
                .build();

        when(auctionService.getAllAuctions()).thenReturn(List.of(auction));

        mockMvc.perform(get("/api/v1/auctions"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].name").value("Test Auction"));
    }
}
