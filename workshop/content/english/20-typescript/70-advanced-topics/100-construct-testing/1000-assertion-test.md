+++
title = "Assertion Tests"
weight = 200
+++

### Fine-Grained Assertion Tests

#### Create a test for the DynamoDB table

{{% notice info %}} This section assumes that you have [created the hit counter construct](/20-typescript/40-hit-counter.html) {{% /notice %}}

Our `HitCounter` construct creates a simple DynamoDB table. Lets create a test that
validates that the table is getting created.

If `cdktf init` created a test directory for you, then you should have a `__tests__/main-test.ts` file. Delete this file.

First, let's add `@cdktf/provider-aws` as a Dev dependency

```
npm install -D @cdktf/provider-aws@~20.1.0
```

If you do not already have a `__tests__` directory (usually created automatically when you
run `cdktf init`), then create a `__tests__` directory at the same level as `main.ts`
and then create a file called `hitcounter.test.ts` with the following code.

```typescript
/* eslint-disable import/no-extraneous-dependencies */
import { DynamodbTable as DynamodbTableL1 } from "@cdktf/provider-aws/lib/dynamodb-table";
import { App, Testing } from "cdktf";
import "cdktf/lib/testing/adapters/jest";
import { AwsStack } from "terraconstructs/lib/aws/aws-stack";
import { Code, LambdaFunction, Runtime } from "terraconstructs/lib/aws/compute";
import { HitCounter } from "../lib/hitcounter";

const defaultAwsStackProps = {
  environmentName: "test",
  gridUUID: "test-uuid",
  providerConfig: { region: "us-east-1" },
  gridBackendConfig: {
    address: "http://localhost:3000",
  },
};

describe("HitCounter", () => {
  let app: App;
  let stack: AwsStack;

  // Test set up
  beforeEach(() => {
    app = Testing.app();
    stack = new AwsStack(app, "test", defaultAwsStackProps);
  });

  test("DynamoDB Table Created", () => {
    // WHEN
    new HitCounter(stack, "MyTestConstruct", {
      downstream: new LambdaFunction(stack, "TestFunction", {
        runtime: Runtime.NODEJS_20_X,
        handler: "hello.handler",
        code: Code.fromAsset("lambda"),
      }),
    });

    // THEN
    stack.prepareStack(); // required by terraconstructs
    const template = Testing.synth(stack);
    expect(template).toHaveResource(DynamodbTableL1);
  });
});
```

This test is simply testing to ensure that the synthesized stack includes a DynamoDB table __L1 resource__.

{{% notice info %}}
Constructs are differentiated by levels, L1 indicating the lowest level at the "provider resource level".

TerraConstructs, combines multiple L1 Constructs into L2 Constructs exposing a more intuitive UX.
{{% /notice %}}

Run the test.

```bash
$ npm run test
```

You should see output like this:

```bash
$ npm run test

> cdk-workshop@0.1.0 test /home/cdk-workshop
> jest

 PASS  __tests__/hitcounter.test.ts (5.371 s)
  HitCounter
    ✓ DynamoDB Table Created (112 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        5.467 s, estimated 6 s
```

#### Create a test for the Lambda function

Now lets add another test, this time for the Lambda function that the `HitCounter` construct creates.
This time in addition to testing that the Lambda function is created, we also want to test that
it is created with the two environment variables `DOWNSTREAM_FUNCTION_NAME` & `HITS_TABLE_NAME`.

Add another test below the DynamoDB test. If you remember, when we created the lambda function the
environment variable values were references to other constructs.

{{<highlight ts "hl_lines=6-7">}}
this.handler = new lambda.Function(this, 'HitCounterHandler', {
  runtime: lambda.Runtime.NODEJS_20_X,
  handler: 'hitcounter.handler',
  code: lambda.Code.fromAsset('lambda'),
  environment: {
    DOWNSTREAM_FUNCTION_NAME: props.downstream.functionName,
    HITS_TABLE_NAME: table.tableName
  }
});
{{</highlight>}}

At this point we don't really know what the value of the `functionName` or `tableName` will be since the
CDK will calculate a hash to append to the end of the name of the constructs, so we will just use a
dummy value for now. Once we run the test it will fail and show us the expected value.

Add import for the Terraform AWS Provider `LambdaFunction` L1 resource as well (this L1 conflicts with TerraConstructs L2!):

```typescript
import { LambdaFunction as LambdaFunctionL1 } from "@cdktf/provider-aws/lib/lambda-function";
```

Create a new test in `hitcounter.test.ts` with the below code:

```typescript
  test('Lambda Has Environment Variables', () => {
    // WHEN
    new HitCounter(stack, 'MyTestConstruct', {
      downstream:  new LambdaFunction(stack, 'TestFunction', {
        runtime: Runtime.NODEJS_20_X,
        handler: 'hello.handler',
        code: Code.fromAsset('lambda')
      })
    });

    // THEN
    stack.prepareStack(); // required by terraconstructs
    const template = Testing.synth(stack);
    expect(template).toHaveResourceWithProperties(LambdaFunctionL1, {
      environment: {
        variables: {
          DOWNSTREAM_FUNCTION_NAME: "\${aws_lambda_function.TestFunction_XXXX.function_name}",
          HITS_TABLE_NAME: "\${aws_dynamodb_table.MyTestConstruct_Hits_YYYY.name}"
        }
      }
    });
  });
```

Save the file and run the test again.

```bash
$ npm run test
```

This time the test should fail and you should be able to grab the correct value for the
variables from the expected output.

{{<highlight bash "hl_lines=19-20">}}
$ npm run test

> cdk-workshop@0.1.0 test /home/cdk-workshop
> jest
 FAIL  __tests__/hitcounter.test.ts (5.479 s)
  HitCounter
    ✓ DynamoDB Table Created (113 ms)
    ✕ Lambda Has Environment Variables (26 ms)

  ● HitCounter › Lambda Has Environment Variables

    Expected aws_lambda_function with properties {"environment":{"variables":{"DOWNSTREAM_FUNCTION_NAME":"${aws_lambda_function.TestFunction_XXXX.function_name}","HITS_TABLE_NAME":"${aws_dynamodb_table.MyTestConstruct_Hits_YYYY.name}"}}} to be present in synthesized stack.
    Found 2 aws_lambda_function resources instead:
    [
      {
        # ...
        "environment": {
          "variables": {
            "DOWNSTREAM_FUNCTION_NAME": "${aws_lambda_function.TestFunction_22AD90FC.function_name}",
            "HITS_TABLE_NAME": "${aws_dynamodb_table.MyTestConstruct_Hits_24A357F0.name}"
          }
        },
        "function_name": "test-uuid-testMyTesctHitCounterHandler",
        # ...
      },
      {
        # ...
      }
    ]

      56 |     stack.prepareStack(); // required by terraconstructs
      57 |     const template = Testing.synth(stack);
    > 58 |     expect(template).toHaveResourceWithProperties(LambdaFunctionL1, {
         |                      ^
      59 |         environment: {
      60 |             "variables": {
      61 |               "DOWNSTREAM_FUNCTION_NAME": "\${aws_lambda_function.TestFunction_XXXX.function_name}",

      at Object.<anonymous> (__tests__/hitcounter.test.ts:58:22)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 passed, 2 total
Snapshots:   0 total
Time:        5.577 s, estimated 6 s
Ran all test suites.
{{</highlight>}}

Grab the real values for the environment variables and update your test

{{<highlight ts "hl_lines=17-18">}}
  test('Lambda Has Environment Variables', () => {
    // WHEN
    new HitCounter(stack, 'MyTestConstruct', {
      downstream:  new LambdaFunction(stack, 'TestFunction', {
        runtime: Runtime.NODEJS_20_X,
        handler: 'hello.handler',
        code: Code.fromAsset('lambda')
      })
    });

    // THEN
    stack.prepareStack(); // required by terraconstructs
    const template = Testing.synth(stack);
    expect(template).toHaveResourceWithProperties(LambdaFunctionL1, {
      environment: {
        variables: {
          DOWNSTREAM_FUNCTION_NAME: "VALUE_GOES_HERE",
          HITS_TABLE_NAME: "VALUE_GOES_HERE"
        }
      }
    });
  });
{{</highlight>}}

Now run the test again. This time is should pass.

```bash
$ npm run test
```

You should see output like this:

```bash
$ npm run test

> cdk-workshop@0.1.0 test /home/cdk-workshop
> jest

 PASS  __tests__/hitcounter.test.ts
  HitCounter
    ✓ DynamoDB Table Created (101 ms)
    ✓ Lambda Has Environment Variables (24 ms)

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        3.692 s, estimated 4 s
Ran all test suites.
```

You can also apply TDD (Test Driven Development) to developing CDK Constructs. For a very simple example, lets add a new
requirement that our DynamoDB table be encrypted.

First we'll update the test to reflect this new requirement.

{{<highlight ts "hl_lines=14-18">}}
  test("DynamoDB Table Created", () => {
    // WHEN
    new HitCounter(stack, "MyTestConstruct", {
      downstream: new LambdaFunction(stack, "TestFunction", {
        runtime: Runtime.NODEJS_20_X,
        handler: "hello.handler",
        code: Code.fromAsset("lambda"),
      }),
    });

    // THEN
    stack.prepareStack(); // required by terraconstructs
    const template = Testing.synth(stack);
    expect(template).toHaveResourceWithProperties(DynamodbTable, {
      "server_side_encryption": {
        "enabled": true
      },
    });
  });
{{</highlight>}}

Now run the test, which should fail.

```bash
$ npm run test

> cdk-workshop@0.1.0 test /home/cdk-workshop
> jest
 FAIL  __tests__/hitcounter.test.ts (5.446 s)
  HitCounter
    ✕ DynamoDB Table Created (109 ms)
    ✓ Lambda Has Environment Variables (24 ms)

  ● HitCounter › DynamoDB Table Created

    Expected aws_dynamodb_table with properties {"server_side_encryption":{"enabled":true}} to be present in synthesized stack.
    Found 1 aws_dynamodb_table resources instead:
    [
      {
        "attribute": [
          {
            "name": "path",
            "type": "S"
          }
        ],
        "billing_mode": "PROVISIONED",
        "hash_key": "path",
        "name": "testMyTestConstructHitsF4EF9DA1",
        "read_capacity": 5,
        "tags": {
          "Name": "test-Hits",
          "grid:EnvironmentName": "test",
          "grid:UUID": "test-uuid"
        },
        "write_capacity": 5
      }
    ]

      40 |     stack.prepareStack(); // required by terraconstructs
      41 |     const template = Testing.synth(stack);
    > 42 |     expect(template).toHaveResourceWithProperties(DynamodbTable, {
         |                      ^
      43 |       "server_side_encryption": {
      44 |         "enabled": true
      45 |       },

      at Object.<anonymous> (__tests__/hitcounter.test.ts:42:22)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 passed, 2 total
Snapshots:   0 total
Time:        5.542 s
Ran all test suites.
```

Now lets fix the broken test. Update the hitcounter code to enable encryption by default.

{{<highlight ts "hl_lines=8 24">}}
import { Construct } from "constructs";
import {
  Code,
  LambdaFunction,
  IFunction,
  Runtime,
} from "terraconstructs/lib/aws/compute";
import { AttributeType, Table, TableEncryption } from "terraconstructs/lib/aws/storage";

export interface HitCounterProps {
  /** the function for which we want to count url hits **/
  downstream: IFunction;
}

export class HitCounter extends Construct {
  /** allows accessing the counter function */
  public readonly handler: LambdaFunction;

  constructor(scope: Construct, id: string, props: HitCounterProps) {
    super(scope, id);

    const table = new Table(this, "Hits", {
      partitionKey: { name: "path", type: AttributeType.STRING },
      encryption: TableEncryption.AWS_MANAGED
    });

    this.handler = new LambdaFunction(this, "HitCounterHandler", {
      runtime: Runtime.NODEJS_20_X,
      handler: "hitcounter.handler",
      code: Code.fromAsset("lambda"),
      environment: {
        DOWNSTREAM_FUNCTION_NAME: props.downstream.functionName,
        HITS_TABLE_NAME: table.tableName,
      },
    });

    // grant the lambda role read/write permissions to our table
    table.grantReadWriteData(this.handler);

    // grant the lambda role invoke permissions to the downstream function
    props.downstream.grantInvoke(this.handler);
  }
}
{{</highlight>}}

Now run the test again, which should now pass.

```bash
npm run test

> cdk-workshop@0.1.0 test /home/cdk-workshop
> jest

 PASS  __tests__/hitcounter.test.ts
  HitCounter
    ✓ DynamoDB Table Created (102 ms)
    ✓ Lambda Has Environment Variables (23 ms)

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        3.714 s, estimated 6 s
Ran all test suites.
```

{{< nextprevlinks >}}