import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { withCorsHeaders } from '../common/middleware';
import { HttpSuccess, InternalServerError, BadRequestError } from '../common/httpResponses';
import { BUCKET_NAME, s3Client, ERROR_MESSAGES } from '../constants';

export const importProductsFile = async (event) => {
  const { name } = event?.queryStringParameters || {};
  console.log(`File import called with name=${name}`, JSON.stringify(event));

  if (!name || !name.trim?.()?.length) {
    return new BadRequestError(ERROR_MESSAGES.NO_FILE_NAME);
  }

  const params = {
    Bucket: BUCKET_NAME,
    Key: `uploaded/${name}.csv`,
    Expires: 60,
    ContentType: 'text-csv',
  };
  const command = new GetObjectCommand(params);

  try {
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return new HttpSuccess(url);
  } catch(error) {
    console.error('Errored', JSON.stringify(error));
    return new InternalServerError(error?.message);
  }
}

export default withCorsHeaders(importProductsFile);
