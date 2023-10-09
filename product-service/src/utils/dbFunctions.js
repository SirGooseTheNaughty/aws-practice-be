import productsMock from '../mocks/products.json';

export const getDbProducts = async () => {
  return Promise.resolve(productsMock); // simulate read from the db
};

export const getDbProductById = async (productId) => {
  const products = await Promise.resolve(productsMock); // simulate read from the db
  const product = products.find(({ id }) => id === productId);
  if (!product) {
    throw new Error('Product not found');
  }
  return product;
};
