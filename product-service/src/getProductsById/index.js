import { getDbProductById } from '../utils/dbFunctions';

const getProductsById = async (event) => {
  const { id } = event?.queryStringParameters || {};

  if (!id) {
    return {
      statusCode: 400,
      message: 'Product id not specified',
    };
  }

  try {
    const product = await getDbProductById(id);
    return {
      statusCode: 200,
      body: JSON.stringify(product),
    };
  } catch (e) {
    return {
      statusCode: 400,
      message: e.message,
    };
  }
};

export default getProductsById;
