+++
title = "Exposing our hit counter table"
weight = 400
+++

## Add a table property to our hit counter

Edit `lib/hitcounter.ts` and modify it as such `table` is exposed as a public property.

{{<highlight ts "hl_lines=19-20 28">}}
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

  /** the hit counter table */
  public readonly table: Table;

  constructor(scope: Construct, id: string, props: HitCounterProps) {
    super(scope, id);

    const table = new Table(this, "Hits", {
      partitionKey: { name: "path", type: AttributeType.STRING },
    });
    this.table = table;

    this.handler = new LambdaFunction(this, "HitCounterHandler", {
      runtime: Runtime.NODEJS_22_X,
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

## Now we can access the table from our stack

Go back to `main.ts` and assign the `table` property of the table viewer:

{{<highlight ts "hl_lines=37">}}import { TableViewer } from "@tcons/cdk-dynamo-table-viewer";
import { App } from "cdktf";
import { Construct } from "constructs";
import { AwsStack, AwsStackProps } from "terraconstructs/lib/aws";
import {
  Code,
  LambdaFunction,
  Runtime,
  LambdaRestApi,
} from "terraconstructs/lib/aws/compute";
import { HitCounter } from "./lib/hitcounter";

class MyStack extends AwsStack {
  constructor(scope: Construct, id: string, props: AwsStackProps) {
    super(scope, id, props);

    // defines an AWS Lambda resource
    const hello = new LambdaFunction(this, "HelloHandler", {
      // functionNamePrefix: "your-hello-handler",
      runtime: Runtime.NODEJS_22_X,
      code: Code.fromAsset("lambda"),
      handler: "hello.handler",
    });

    const helloWithCounter = new HitCounter(this, "HelloHitCounter", {
      downstream: hello,
    });

    // defines an API Gateway REST API resource backed by our "hello" function.
    new LambdaRestApi(this, "Endpoint", {
      handler: helloWithCounter.handler,
      registerOutputs: true,
    });

    new TableViewer(this, "ViewHitCounter", {
      title: "Hello Hits",
      table: helloWithCounter.table,
    });
  }
}

const app = new App();
new MyStack(app, "cdk-workshop", {
  environmentName: "dev",
  gridUUID: "cdk-workshop-dev",
  providerConfig: {
    region: "us-east-1",
  },
});
app.synth();
{{</highlight>}}

We're finished making code changes,
so once you save this file,
you can close the `npm run watch` command with `Ctrl-C`.

{{< nextprevlinks >}}