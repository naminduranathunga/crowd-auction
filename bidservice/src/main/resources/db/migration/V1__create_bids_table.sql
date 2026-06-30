CREATE TABLE bids (
    id BIGSERIAL PRIMARY KEY,
    item_id BIGINT NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    amount DECIMAL(19, 2) NOT NULL,
    created_at TIMESTAMP NOT NULL
);

CREATE INDEX idx_bids_item_id_created_at ON bids(item_id, created_at DESC);
