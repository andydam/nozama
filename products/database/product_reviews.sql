CREATE TABLE `product_reviews`(
 `id` INTEGER NOT NULL AUTO_INCREMENT,
 `text` VARCHAR(15000) NOT NULL,
 `user_id` INTEGER NOT NULL,
 `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 `stars` DOUBLE NULL,
 `credibility` DOUBLE NULL,
 `is_customer` TINYINT(1) NOT NULL,
 `is_professional` TINYINT(1) NOT NULL,
 `product_id` VARCHAR(20) NOT NULL,
 PRIMARY KEY(`id`)
);
