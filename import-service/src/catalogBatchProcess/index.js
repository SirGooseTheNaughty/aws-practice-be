import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { createProduct } from './productOperations';
import { REGION } from '../constants';

export const sendSns = async (productData) => {
  const snsClient = new SNSClient({ region: REGION });

  try {
    const publishCommand = new PublishCommand({
      Subject: 'Product added',
      Message: `Product ${productData.title} successfully added`,
      TopicArn: process.env.SNS_ARN,
      MessageAttributes: {
        title: {
          DataType: "String",
          StringValue: productData.title
        },
        price: {
          DataType: "Number",
          StringValue: productData.price.toString(),
        }
      }
    });

    await snsClient.send(publishCommand);
    console.log('Published an SNS message');
  } catch(error) {
    console.error(`Couldn't send an SNS message: ${JSON.stringify(error)}`);
  }
};

export const catalogBatchProcess = async (event) => {
  console.log(`Got import products event from queue: ${JSON.stringify(event)}`);

  for (const { body } of event?.Records) {
    console.log(`Event body: ${body}`);
    try {
      const productData = JSON.parse(body);
      const response = await createProduct(productData);
      console.log(`Successfully created a product: ${JSON.stringify(response)}`);

      await sendSns(productData);
    } catch (error) {
      console.error(`Couldn't create a product: ${JSON.stringify(error)}`);
    }
  }
};

export default catalogBatchProcess;
