import { Client } from 'pg';
import { v4 as uuidv4 } from 'uuid';
import { getCurrentDate } from '../common/utils';
import { CART_STATUSES } from '../common/constants';

const getClient = async () => {
  const client = new Client({
    host: process.env.DB_ENDPOINT,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    ssl: {
      rejectUnauthorized: false,
    },
    connectionTimeoutMillis: 5000,
  });
  await client.connect();
  return client;
}

export const getOrCreateUser = async (client, token) => {
  console.log(`Looking for user with token ${token}`);
  const userQueryResult = await client.query({
    text: 'SELECT id FROM users WHERE token = $1',
    values: [token]
  });
  const userId = userQueryResult.rows[0]?.id;
  if (userId) {
    console.log(`Found a user with id ${userId}`);
    return userId;
  }
  const newUserQueryResult = await client.query({
    text: 'INSERT INTO users (token) values ($1) RETURNING id',
    values: [token]
  });
  const newUserId = newUserQueryResult.rows[0]?.id;
  console.log(`Created a user with id ${newUserId}`);
  return newUserId;
};

export const getActiveUserCart = async (client, userId) => {
  console.log(`Looking for an OPEN cart for a user with id ${userId}`);
  const cartQueryResult = await client.query({
    text: 'SELECT id FROM carts WHERE user_id=$1 AND status=$2',
    values: [userId, CART_STATUSES.OPEN]
  });
  const cartId = cartQueryResult.rows[0]?.id;
  if (cartId) {
    console.log(`Found a cart with id ${cartId}`);
    return cartId;
  }
  const date = getCurrentDate();
  const newCartQueryResult = await client.query({
    text: 'INSERT INTO carts (user_id, created_at, updated_at, status) values ($1, $2, $2, $3) RETURNING id',
    values: [userId, date, CART_STATUSES.OPEN],
  });
  const newCartId = newCartQueryResult.rows[0]?.id;
  console.log(`Created a cart with id ${newCartId}`);
  return newCartId;
};

export const getCart = async (client, cartId) => {
  console.log(`Getting a cart by id ${cartId}`);
  const cartQueryResult = await client.query({
    text: 'SELECT * FROM carts INNER JOIN cart_items ON carts.id=cart_items.cart_id WHERE id = $1',
    values: [cartId]
  });
  console.log(`Got a cart with id ${cartId}: `, cartQueryResult.rows);
  return cartQueryResult.rows;
};

export const getUserCart = async (token) => {
  const client = await getClient();
  const userId = await getOrCreateUser(client, token);
  const cartId = await getActiveUserCart(client, userId);
  const cart = await getCart(client, cartId);
  await client.end();
  return cart;
};

const addOrCreateProductToCart = async (client, cartId, productId, count = 1) => {
  let product = await client.query({
    text: 'SELECT * FROM cart_items WHERE cart_id = $1 AND product_id=$2',
    values: [cartId, productId]
  });
  console.log(`For cartId ${cartId} and productId ${productId} got product: `, JSON.stringify(product));
  if (!product?.rows?.[0]) {
    product = await client.query({
      text: 'INSERT INTO cart_items (cart_id, product_id, count) values ($1, $2, $3)',
      values: [cartId, productId, count]
    });
  } else {
    const productId = product?.rows?.[0]?.product_id || 0;
    product = await client.query({
      text: 'UPDATE cart_items SET count=$1 WHERE cart_id=$2 AND product_id=$3',
      values: [count, cartId, productId]
    });
  }
  console.log(`Resulting product: `, JSON.stringify(product));
  return product?.rowCount;
};

export const addProductToCart = async (token, productId, count) => {
  const client = await getClient();
  const userId = await getOrCreateUser(client, token);
  const cartId = await getActiveUserCart(client, userId);
  const result = await addOrCreateProductToCart(client, cartId, productId, count);
  await client.end();
  return result;
};

const createAnOrder = async (client, userId, cartId) => {
  console.log(`Placing an order for user ${userId} and cart ${cartId}`);
  const orderQueryResult = await client.query({
    text: 'INSERT INTO orders (user_id, cart_id, status) values ($1, $2, $3) RETURNING id',
    values: [userId, cartId, 'OPEN']
  });
  const orderId = orderQueryResult.rows[0]?.id;
  console.log(`Placed an order with id ${orderId}`);
  return orderId;
};

const setCartToOrdered = (client, cartId) => {
  console.log(`Setting cart ${cartId} status to ${CART_STATUSES.ORDERED}`);
  return client.query({
    text: 'UPDATE carts SET status=$1 WHERE id=$2',
    values: [CART_STATUSES.ORDERED, cartId]
  });
};

export const placeOrder = async (token) => {
  const client = await getClient();
  let orderId;

  try {
    await client.query('BEGIN');
    const userId = await getOrCreateUser(client, token);
    const cartId = await getActiveUserCart(client, userId);
    orderId = await createAnOrder(client, userId, cartId);
    await setCartToOrdered(client, cartId);
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    await client.end();
  }

  return orderId;
};
