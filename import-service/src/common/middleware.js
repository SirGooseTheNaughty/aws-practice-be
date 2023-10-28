export const withCorsHeaders = (handler) => async (event) => {
  const result = await handler(event);
  return {
    ...result,
    headers: {
      ...(result.headers || {}),
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    }
  }
}