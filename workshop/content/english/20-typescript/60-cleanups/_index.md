+++
title = "Clean up"
weight = 60
bookFlatSection = true
+++

# Clean up your stack

{{% notice danger %}}

Current version of TerraConstructs does **NOT** retain persistent data such as DynamoDb Tables.
Terraform will brutally destroy your data if you are not careful.

{{% /notice %}}

<!--
When destroying a stack, resources may be deleted, retained, or snapshotted according to their deletion policy.
By default, most resources will get deleted upon stack deletion, however that's not the case for all resources.
The DynamoDB table will be retained by default. If you don't want to retain this table, we can set this in CDK
code by using `RemovalPolicy`:


## Set the DynamoDB table to be deleted upon stack deletion

Edit `hitcounter.ts` and add the `removalPolicy` prop to the table

{{<highlight ts "hl_lines=25-26">}}
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export interface HitCounterProps {
  /** the function for which we want to count url hits **/
  downstream: lambda.IFunction;
}

export class HitCounter extends Construct {
  /** allows accessing the counter function */
  public readonly handler: lambda.Function;

  /** the hit counter table */
  public readonly table: dynamodb.Table;

  constructor(scope: Construct, id: string, props: HitCounterProps) {
    super(scope, id);

    const table = new dynamodb.Table(this, "Hits", {
      partitionKey: {
        name: "path",
        type: dynamodb.AttributeType.STRING
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });
    this.table = table;

    this.handler = new lambda.Function(this, 'HitCounterHandler', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'hitcounter.handler',
      code: lambda.Code.fromAsset('lambda'),
      environment: {
        DOWNSTREAM_FUNCTION_NAME: props.downstream.functionName,
        HITS_TABLE_NAME: table.tableName
      }
    });

    // grant the lambda role read/write permissions to our table
    table.grantReadWriteData(this.handler);

    // grant the lambda role invoke permissions to the downstream function
    props.downstream.grantInvoke(this.handler);
  }
}
{{</highlight>}}

Since we made a change in the construct file, we need to redeploy the stack to put the changes into effect. Use `cdk deploy`:

```
cdktf deploy
```

Additionally, the Lambda function created will generate CloudWatch logs that are
permanently retained. These will not be tracked by CloudFormation since they are
not part of the stack, so the logs will still persist. You will have to manually
delete these in the console if desired.
-->

<!-- NOTE: API Gateway Account settings will not be removed ... -->

Now that we know which resources will be deleted, we can proceed with deleting the
stack. You can either delete the stack through the AWS CloudFormation console or use
`cdktf destroy`:

```
cdktf destroy
```

You'll be asked:

```
Plan: 0 to add, 0 to change, 44 to destroy.

              Changes to Outputs:
                - EndpointOutputs       = {
                    - restApiId             = "1wtlltjta4"
                    - restApiName           = "cdkworkshopEndpoint424A4D39"
                    - restApiRootResourceId = "2yujx46z9g"
cdk-workshop  - url                   = "https://1wtlltjta4.execute-api.us-east-1.amazonaws.com/prod/"
                  } -> null
                - ViewerEndpointOutputs = {
                    - restApiId             = "xxvnil1249"
                    - restApiName           = "cdkworkshopViewHitCounterViewerEndpoint39EB6BA3"
                    - restApiRootResourceId = "0vk5angn2k"
                    - url                   = "https://xxvnil1249.execute-api.us-east-1.amazonaws.com/prod/"
                  } -> null
```

Select `Approve` and you'll see your stack being destroyed.
