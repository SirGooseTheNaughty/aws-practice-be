import { getBasicTokenFromHeaders } from './utils';
import { UnauthorizedError } from './httpResponses';
import { ERROR_MESSAGES } from './constants';

export const withCorsHeaders = (handler) => async (event) => {
  const result = await handler(event);
  return {
    ...result,
    headers: {
      ...(result.headers || {}),
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
    }
  }
}

export const withAuthCheck = (handler) => async (event) => {
  const token = getBasicTokenFromHeaders(event?.headers);
  if (!token) {
    return new UnauthorizedError(ERROR_MESSAGES.NO_TOKEN);
  }

  return handler({ ...event, token });
};
