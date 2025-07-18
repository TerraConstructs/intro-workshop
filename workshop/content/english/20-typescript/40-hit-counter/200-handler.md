+++
title = "Hit counter handler"
weight = 100
+++

## Hit counter Lambda handler

Okay, now let's write the Lambda handler code for our hit counter.

Create the file `lambda/hitcounter.js`:

```js
const { DynamoDB } = require("@aws-sdk/client-dynamodb");
const { Lambda, InvokeCommand } = require("@aws-sdk/client-lambda");

exports.handler = async function (event) {
  console.log("request:", JSON.stringify(event, undefined, 2));

  // create AWS SDK clients
  const dynamo = new DynamoDB();
  const lambda = new Lambda();

  // update dynamo entry for "path" with hits++
  await dynamo.updateItem({
    TableName: process.env.HITS_TABLE_NAME,
    Key: { path: { S: event.path } },
    UpdateExpression: "ADD hits :incr",
    ExpressionAttributeValues: { ":incr": { N: "1" } },
  });

  // call downstream function and capture response
  const command = new InvokeCommand({
    FunctionName: process.env.DOWNSTREAM_FUNCTION_NAME,
    Payload: JSON.stringify(event),
  });

  const { Payload } = await lambda.send(command);
  const result = Buffer.from(Payload).toString();

  console.log("downstream response:", JSON.stringify(result, undefined, 2));

  // return response back to upstream caller
  return JSON.parse(result);
};
```

## Discovering resources at runtime

You'll notice that this code relies on two environment variables:

 * `HITS_TABLE_NAME` is the name of the DynamoDB table to use for storage.
 * `DOWNSTREAM_FUNCTION_NAME` is the name of the downstream AWS Lambda function.

Since the actual name of the table and the downstream function will only be
decided when we deploy our app, we need to wire up these values from our
construct code. We'll do that in the next section.

{{< nextprevlinks >}}