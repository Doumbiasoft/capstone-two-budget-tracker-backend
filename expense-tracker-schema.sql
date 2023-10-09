
CREATE TABLE users (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  first_name varchar(255) NOT NULL,
  last_name varchar(255) NOT NULL,
  email TEXT NOT NULL,
  password varchar NOT NULL,
  oauth_provider varchar(255),
  oauth_uid varchar(255),
  password_reset_token varchar(255),
  is_oauth boolean DEFAULT false,
  created_at timestamp DEFAULT CURRENT_DATE NOT NULL,
  updated_at timestamp DEFAULT CURRENT_DATE NOT NULL,
  is_active boolean DEFAULT true
);

CREATE TABLE categories (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  user_id bigint REFERENCES users ON DELETE CASCADE,
  name varchar(225) NOT NULL,
  type TEXT,
  created_at timestamp DEFAULT CURRENT_DATE NOT NULL,
  updated_at timestamp DEFAULT CURRENT_DATE NOT NULL
);

CREATE TABLE transactions (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  category_id bigint REFERENCES categories ON DELETE CASCADE,
  user_id bigint REFERENCES users ON DELETE CASCADE,
  amount decimal(10,2) NOT NULL,
  date timestamp NOT NULL,
  note TEXT,
  created_at timestamp DEFAULT CURRENT_DATE NOT NULL,
  updated_at timestamp DEFAULT CURRENT_DATE NOT NULL
);

