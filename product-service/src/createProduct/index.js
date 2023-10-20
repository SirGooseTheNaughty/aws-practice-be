import { createDbProduct } from '../utils/dbFunctions';
import { ERROR_MESSAGES } from '../utils/constants';
import { withCorsHeaders } from '../common/middleware';
import { HttpSuccess, BadRequestError, InternalServerError } from '../common/httpResponses';

export const createProduct = async (event = {}, context = {}) => {
  console.log(`Event: ${JSON.stringify(event)}. Context: ${JSON.stringify(context)}.`);
  const { title, description, price, stock } = JSON.parse(event.body);

  console.log(`Product data: ${JSON.stringify({ title, description, price, stock })}`);

  if (!title || isNaN(price)) {
    return new BadRequestError(ERROR_MESSAGES.INVALID_PRODUCT_DATA);
  }

  try {
    const id = await createDbProduct({ title, description, price, stock });

    return new HttpSuccess(id);
  } catch (error) {
    return new InternalServerError(error?.message);
  }
};

export default withCorsHeaders(createProduct);
