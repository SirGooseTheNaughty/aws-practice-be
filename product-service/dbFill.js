const AWS = require('aws-sdk');
const crypto = require('crypto');
const productsData = require('./src/mocks/products.json');

AWS.config.update({ region: 'eu-west-1' });
const docClient = new AWS.DynamoDB.DocumentClient();

productsData.forEach((product) => {
  const { title, description, price } = product;
  const newId = crypto.randomUUID();
  const quantity = Math.floor(Math.random() * 10);
  const productData = { id: newId, title, description, price };
  const stockData = { product_id: newId, count: quantity };

  docClient.put({
    TableName: 'products',
    Item: productData
  }, (err)=>{
    if (err) {
      console.error(err);
    } else {
      console.log(`Added ${productData.title}`);
    }
  });

  docClient.put({
    TableName: 'stocks',
    Item: stockData
  }, (err)=>{
    if(err) {
      console.error(err);
    } else {
      console.log(`Added ${productData.title}'s quantity`);
    }
  });
});

