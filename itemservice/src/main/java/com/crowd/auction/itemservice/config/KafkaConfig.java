package com.crowd.auction.itemservice.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaConfig {

    @Bean
    public NewTopic auctionEventsTopic() {
        return TopicBuilder.name("auction-events")
                .partitions(3)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic itemEventsTopic() {
        return TopicBuilder.name("item-events")
                .partitions(3)
                .replicas(1)
                .build();
    }
}
