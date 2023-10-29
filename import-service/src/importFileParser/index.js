import { GetObjectCommand, DeleteObjectCommand, CopyObjectCommand} from '@aws-sdk/client-s3';
import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { BUCKET_NAME, s3Client } from '../constants';

const csv = require('csv-parser');

const sqsClient = new SQSClient({});
const SQS_QUEUE_URL = process.env.SQS_URL;

export const moveFileToParsed = async (sourceKey) => {
  console.log(JSON.stringify({
    CopySource: sourceKey,
    Bucket: BUCKET_NAME,
    Key: sourceKey.replace('uploaded', 'parsed'),
  }));
  const copyCommand = new CopyObjectCommand({
    CopySource: sourceKey,
    Bucket: BUCKET_NAME,
    Key: sourceKey.replace('uploaded', 'parsed'),
  });
  console.log(JSON.stringify(copyCommand));
  const deleteCommand = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: sourceKey,
  });

  try {
    const copyResponse =  await s3Client.send(copyCommand);
    console.log('Successfully copied a parsed file to /parsed', JSON.stringify(copyResponse));
  } catch (error) {
    console.error('Could not move the file', JSON.stringify(error));
  }
  try {
    const deleteResponse = await s3Client.send(deleteCommand);
    console.log('Successfully removed a file from /uploaded', JSON.stringify(deleteResponse));
  } catch (error) {
    console.error('Could not delete the file', JSON.stringify(error));
  }
};

const sendQueueMessage = async (body) => {
  console.log(`Sending a message to queue ${SQS_QUEUE_URL}: ${JSON.stringify(body)}`);
  const command = new SendMessageCommand({
    QueueUrl: SQS_QUEUE_URL,
    MessageBody: JSON.stringify(body),
  });

  try {
    const response = await sqsClient.send(command);
    console.log(`Queue send response: ${JSON.stringify(response)}`);
  } catch(error) {
    console.error(`Queue send error: ${JSON.stringify(error)}`);
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
      response.Body
        .pipe(csv())
        .on('data', (data) => {
          console.log('Piped data: ', JSON.stringify(data));
          sendQueueMessage(data);
        })
        .on('end', () => console.log('Processed csv successfully'));

      await moveFileToParsed(record.s3.object.key);
    } catch (error) {
      console.error('Errored', JSON.stringify(error));
    }
  }
}

export default importFileParser;
