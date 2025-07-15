+++
title = "Define resources"
weight = 300
+++

## Add resources to the hit counter construct

Now, let's define the AWS Lambda function and the DynamoDB table in our
`HitCounter` construct. Go back to `lib/hitcounter.ts` and add the following highlighted code:

{{<highlight ts "hl_lines=3-4 6 16-17 22-34">}}
import { Construct } from "constructs";
import {
  Code,
  LambdaFunction,
  IFunction,
  Runtime,
} from "terraconstructs/lib/aws/compute";
import { AttributeType, Table } from "terraconstructs/lib/aws/storage";

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
    });

    this.handler = new LambdaFunction(this, "HitCounterHandler", {
      runtime: Runtime.NODEJS_22_X,
      handler: "hitcounter.handler",
      code: Code.fromAsset("lambda"),
      environment: {
        DOWNSTREAM_FUNCTION_NAME: props.downstream.functionName,
        HITS_TABLE_NAME: table.tableName,
      },
    });
  }
}
{{</highlight>}}

## What did we do here?

This code is hopefully quite easy to understand:

 * We defined a DynamoDB table with `path` as the partition key.
 * We defined a Lambda function which is bound to the `lambda/hitcounter.handler` code.
 * We __wired__ the Lambda's environment variables to the `functionName` and `tableName`
   of our resources.

## Late-bound values

The `functionName` and `tableName` properties are values that only resolve when
we deploy our stack (notice that we haven't configured these physical names when
we defined the table/function, only logical IDs). This means that if you print
their values during synthesis, you will get a "TOKEN", which is how the CDK
represents these late-bound values. You should treat tokens as *opaque strings*.
This means you can concatenate them together for example, but don't be tempted
to parse them in your code.

{{< nextprevlinks >}}