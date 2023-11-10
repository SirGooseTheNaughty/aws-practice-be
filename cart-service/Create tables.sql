create extension if not exists "uuid-ossp";

drop type if exists status;
create type status as enum ('OPEN', 'ORDERED');

create table users (
	id uuid primary key default uuid_generate_v4(),
	token char(100)
);

create table carts (
	id uuid primary key default uuid_generate_v4(),
	user_id uuid,
	created_at date,
	updated_at date,
	status status,
	foreign key ("user_id") references "users" ("id")
);

create table cart_items (
	cart_id uuid,
	product_id uuid,
	count int default 1,
	foreign key ("cart_id") references "carts" ("id")
);

create table orders (
	id uuid primary key default uuid_generate_v4(),
	user_id uuid,
	cart_id uuid,
	payment json,
	delivery json,
	comments char(255),
	status status,
	total Integer,
	foreign key ("user_id") references "users" ("id"),
	foreign key ("cart_id") references "carts" ("id")
);
