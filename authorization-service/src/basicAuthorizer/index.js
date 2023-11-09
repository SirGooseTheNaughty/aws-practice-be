const generatePolicy = (principalId, resource, effect = 'Deny') => ({
  principalId,
  policyDocument: {
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: resource,
      }
    ]
  }
});

export const basicAuthorizer = (event, context, callback) => {
  console.log(`Event: ${JSON.stringify(event)}`);
  console.log(`Env: ${JSON.stringify(process.env)}`);

  if (event.type !== 'REQUEST') {
    callback('Unauthorized');
  }

  try {
    const encodedCredentials =  event.headers?.authorization?.split(' ')[1];
    const buff = Buffer.from(encodedCredentials, 'base64');
    const [username, password] = buff.toString('utf-8').split(':');

    console.log(`username: ${username}, password: ${password}`);

    const isValid = process.env[username] && process.env[username] === password;
    const effect = isValid ? 'Allow' : 'Deny';
    console.log('Effect: ', effect);
    const policy = generatePolicy(encodedCredentials, event.routeArn, effect);
    console.log('Policy: ', JSON.stringify(policy));

    callback(null, policy);
  } catch (error) {
    console.log(`Error: ${error?.message}`, JSON.stringify(error));
    callback(`Unauthorized: ${error.message}`);
  }
};

export default basicAuthorizer;
