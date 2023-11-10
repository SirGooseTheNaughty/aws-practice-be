import { Client } from 'pg';

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

export const getCart = async (client, userId) => {
  console.log(`Getting a cart for user ${userId}`);
  return client.query({
    text: 'SELECT * FROM carts RIGHT JOIN cart_items ON carts.id=cart_items.cart_id WHERE user_id = $1',
    values: [userId]
  });
};

export const createCart = async (client, userId) => {
  console.log(`Creating a cart for user ${userId}`);
  const dateObject = new Date();
  const date = dateObject.toISOString().split('T')[0];
  return client.query({
    text: `INSERT INTO carts (user_id, created_at, updated_at, status) values ($1, $2, $3, $4)`,
    values: [userId, date, date, 'OPEN']
  });
};

export const findOrCreateByUserId = async (userId, existingClient = null) => {
  const client = existingClient || await getClient();
  let data = await getCart(client, userId);
  if (!data) {
    data = await createCart(client, userId);
  }
  if (!existingClient) {
    await client.end();
  }
  return data;
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
  return product;
};

export const addProductToCart = async (userId, productId, count) => {
  const client = await getClient();
  const cart = await findOrCreateByUserId(userId, client);
  const cartId = cart?.rows?.[0]?.id;
  const result = await addOrCreateProductToCart(client, cartId, productId, count);
  await client.end();
  return result;
};
