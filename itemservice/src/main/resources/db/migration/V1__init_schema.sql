CREATE TABLE auctions (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    status VARCHAR(50) NOT NULL
);

CREATE TABLE items (
    id BIGSERIAL PRIMARY KEY,
    auction_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_price DECIMAL(19, 2) NOT NULL,
    current_price DECIMAL(19, 2) NOT NULL,
    CONSTRAINT fk_auction FOREIGN KEY (auction_id) REFERENCES auctions(id) ON DELETE CASCADE
);

CREATE INDEX idx_auction_user_id ON auctions(user_id);
CREATE INDEX idx_item_auction_id ON items(auction_id);
