DROP TABLE IF EXISTS endpointTest;

CREATE TABLE endpointTest (
  id serial PRIMARY KEY,
  link varchar NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_request_at TIMESTAMPTZ DEFAULT NOW(),
  count int DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE
);
