export const getCurrentDate = () => {
  const dateObject = new Date();
  return dateObject.toISOString().split('T')[0];
};

export const getBasicTokenFromHeaders = (headers) => {
  return headers?.authorization?.split(' ')[1];
};
