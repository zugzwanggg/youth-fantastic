CREATE TYPE user_role AS ENUM ('admin', 'supplier', 'business');
CREATE TYPE pool_status AS ENUM ('open', 'filled', 'expired', 'cancelled');

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    description TEXT,
    user_type user_role NOT NULL DEFAULT 'business',
    created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    supplier_id INT REFERENCES users(id),
    category_id INT REFERENCES categories(id),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT NOT NULL,
    price NUMERIC(12,2) NOT NULL,
    unit TEXT NOT NULL,
    moq INT NOT NULL DEFAULT 1, 
    created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE group_buy_pools (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(id),
    target_qty INT NOT NULL,
    status pool_status NOT NULL DEFAULT 'open',
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE group_buy_commitments (
    id SERIAL PRIMARY KEY,
    pool_id INT REFERENCES group_buy_pools(id),
    business_id INT REFERENCES users(id),
    supplier_id INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT now()
);
