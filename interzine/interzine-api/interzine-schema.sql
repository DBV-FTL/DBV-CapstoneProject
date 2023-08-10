CREATE TABLE users (
    id          SERIAL PRIMARY KEY,
    first_name  VARCHAR(255) NOT NULL,
    last_name   VARCHAR(255) NOT NULL,
    username    VARCHAR(255) NOT NULL,
    email       VARCHAR(255) NOT NULL UNIQUE CHECK (position('@' IN email) > 1),
    password    VARCHAR(255) NOT NULL,
    zip_code    INTEGER   CHECK (zip_code between 99 and 99999));

CREATE TABLE service_providers (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    cuisine     VARCHAR(255) NOT NULL,
    email       VARCHAR(255) NOT NULL UNIQUE CHECK (position('@' IN email) > 1),
    password    VARCHAR(255) NOT NULL,
    profile_picture VARCHAR(8000) NOT NULL,
    service_provider_hero VARCHAR(8000),
    service_provider_blurb TEXT,
    zip_code    INTEGER NOT NULL CHECK (zip_code between 99 and 99999),
    address     VARCHAR(255) NOT NULL);

CREATE TABLE menu_items (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    image_url   VARCHAR(8000) NOT NULL,
    cost        DECIMAL(10,2) NOT NULL,
    rating      DECIMAL(3,2),
    service_provider_id INTEGER, 
    FOREIGN KEY (service_provider_id) REFERENCES service_providers(id));


CREATE TABLE orders (
    id          SERIAL PRIMARY KEY,
    date        VARCHAR(255) NOT NULL,
    provider_id INTEGER,
    user_id     INTEGER, 
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (provider_id) REFERENCES service_providers(id));


CREATE TABLE order_details(
    id          SERIAL PRIMARY KEY,
    order_id    INTEGER,
    quantity    INTEGER NOT NULL DEFAULT 0,
    cost        DECIMAL(10,2) NOT NULL,
    image_url   VARCHAR(255) NOT NULL,
    product_name    VARCHAR(255) NOT NULL,
    menu_item_id    INTEGER, 
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id),
    FOREIGN KEY (order_id) REFERENCES orders(id));