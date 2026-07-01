CREATE TABLE item_images (
    id BIGSERIAL PRIMARY KEY,
    item_id BIGINT NOT NULL,
    object_key VARCHAR(512) NOT NULL UNIQUE,
    image_url TEXT NOT NULL,
    original_filename VARCHAR(255),
    content_type VARCHAR(255),
    sort_order INT NOT NULL DEFAULT 0,
    primary_image BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_item_images_item FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
);

CREATE INDEX idx_item_images_item_id ON item_images(item_id);