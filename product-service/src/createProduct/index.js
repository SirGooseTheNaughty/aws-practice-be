import { createDbProduct } from '../utils/dbFunctions';
import { withCorsHeaders } from '../utils/middleware';
import { ERROR_MESSAGES, BadRequestError, InternalServerError } from '../utils/constants';

export const createProduct = async (event = {}, context = {}) => {
  console.log(`Event: ${JSON.stringify(event)}. Context: ${JSON.stringify(context)}.`);
  const { title, description, price } = JSON.parse(event.body);

  console.log(`Product data: ${JSON.stringify({ title, description, price })}`);

  if (!title || isNaN(price)) {
    return new BadRequestError(ERROR_MESSAGES.INVALID_PRODUCT_DATA);
  }

  try {
    const id = await createDbProduct({ title, description, price });

    return {
      statusCode: 200,
      body: id,
    };
  } catch (error) {
    return new InternalServerError(error?.message);
  }
};

export default withCorsHeaders(createProduct);