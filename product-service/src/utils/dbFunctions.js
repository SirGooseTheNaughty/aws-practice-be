import productsMock from '../mocks/products.json';

const checkDb = () => {
  if (Math.random() < 0.05) {
    throw new Error('DB connection problem');
  }
};

export const getDbProducts = async () => {
  checkDb();
  return Promise.resolve(productsMock); // simulate read from the db
};

export const getDbProductById = async (productId) => {
  checkDb();
  if (!productId) {
    throw new Error('Product id not specified');
  }
  const products = await Promise.resolve(productsMock); // simulate read from the db
  const product = products.find(({ id }) => id === productId);
  if (!product) {
    throw new Error('Product not found');
  }
  return product;
};
