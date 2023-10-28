import { GetObjectCommand, DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { BUCKET_NAME, s3Client } from '../constants';

export const moveFileToParsed = async (sourceKey, content) => {
  const saveParsedFileCommand = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: sourceKey.replace('uploaded', 'parsed'),
    Body: content,
  });
  const deleteCommand = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: sourceKey,
  });

  try {
    const saveResponse = await s3Client.send(saveParsedFileCommand);
    console.log('Successfully saved a parsed file to /parsed', JSON.stringify(saveResponse));
    const deleteResponse = await s3Client.send(deleteCommand);
    console.log('Successfully removed a file from /uploaded', JSON.stringify(deleteResponse));
  } catch (error) {
    console.error('Could not move the file', JSON.stringify(error));
  }
};

export const importFileParser = async (event) => {
  console.log('importFileParser triggered', JSON.stringify(event));

  for (const record of event.Records) {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: record.s3.object.key,
    });

    try {
      const response = await s3Client.send(command);
      const result = await response.Body.transformToString();
      console.log('Resulting string: ', JSON.stringify(result));

      await moveFileToParsed(record.s3.object.key, result);
    } catch (error) {
      console.error('Errored', JSON.stringify(error));
    }
  }
}

export default importFileParser;
