create extension if not exists "uuid-ossp";

insert into users (token) values
	('U2lyR29vc2VUaGVOYXVnaHR5OlRFU1RfUEFTU1dPUkQ=');

insert into carts (user_id, created_at, updated_at, status) values
	((select id from users), (select current_date), (select current_date), 'OPEN');

insert into cart_items (cart_id, product_id, count) values
	((select id from carts), 'f9541c17-f3e6-455c-ab65-1e58e68cec33', 1),
	((select id from carts), 'fcbd96b5-5bb3-469c-b781-a0b9cc5ad4b8', 2),
	((select id from carts), '0e8661e1-5e8f-4a98-9888-d8a7fa46f73b', 1);