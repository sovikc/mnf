CREATE TABLE operator (
  operator_id serial NOT NULL PRIMARY KEY,
  operator_uuid varchar(50) NOT NULL UNIQUE,
  first_name varchar(200) NOT NULL,
  last_name varchar(200) NOT NULL,
  email varchar(200) NOT NULL,
  pass varchar(200) NOT NULL,
  created_by varchar(50),
  deactivated boolean DEFAULT FALSE,
  created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_actioned_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE shopping_centre (
  shopping_centre_id serial NOT NULL PRIMARY KEY,
  shopping_centre_uuid varchar(50) NOT NULL UNIQUE,
  shopping_centre_name varchar(50) NOT NULL,
  address_line_one varchar(255) NOT NULL,
  address_line_two varchar(150),
  city varchar(255) NOT NULL,
  state_name varchar(255) NOT NULL,
  postcode varchar(50) NOT NULL, 
  country varchar(50) NOT NULL, 
  created_by varchar(50) NOT NULL,
  deactivated boolean DEFAULT FALSE,
  created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_actioned_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE location_within_centre (
  location_id serial NOT NULL PRIMARY KEY,
  location_uuid varchar(50) NOT NULL UNIQUE,
  location_code varchar(50) NOT NULL,
  shopping_centre_uuid varchar(50) NOT NULL,
  created_by varchar(50) NOT NULL,
  deactivated boolean DEFAULT FALSE,
  created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_actioned_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE asset (
  asset_id serial NOT NULL PRIMARY KEY,
  asset_uuid varchar(50) NOT NULL UNIQUE,
  asset_name varchar(255) NOT NULL UNIQUE,
  asset_active boolean DEFAULT FALSE,
  asset_length numeric(14,2) NOT NULL,
  asset_breadth numeric(14,2) NOT NULL,
  asset_depth numeric(14,2) NOT NULL,
  created_by varchar(50),
  deactivated boolean DEFAULT FALSE,
  created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_actioned_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE change_log (
  log_id serial NOT NULL PRIMARY KEY,
  entity_id integer NOT NULL,
  entity_type varchar(50) NOT NULL,
  operation_type varchar(50) NOT NULL,
  field_name varchar(50) NOT NULL,
  field_value_type varchar(50) NOT NULL,
  field_char_value varchar(50),
  field_numeric_value numeric(14,2),
  field_bool_value boolean,
  created_by varchar(50),
  created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE asset_allocation (
  allocation_id serial NOT NULL PRIMARY KEY,
  shopping_centre_uuid varchar(50) NOT NULL,
  location_uuid varchar(50) NOT NULL,
  asset_uuid varchar(50) NOT NULL,
  created_by varchar(50) NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_actioned_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);