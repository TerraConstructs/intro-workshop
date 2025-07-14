+++
title = "Cleanup sample"
weight = 100
+++

## Delete the sample code from your stack

The project from previous section used an SQS queue, and an SNS topic for demonstration purposes. We're
not going to use them in this project, so remove them from your the
`MyStack` constructor.

Open `main.ts` and clean it up. Eventually it should look like this:

```ts
import { App } from "cdktf";
import { Construct } from "constructs";
import { AwsStack, AwsStackProps } from "terraconstructs/lib/aws";

class MyStack extends AwsStack {
  constructor(scope: Construct, id: string, props: AwsStackProps) {
    super(scope, id, props);

    // Fresh start
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

```

## cdk diff

Now that we modified our stack's contents, we can ask the toolkit to show us the difference between our CDK app and
what's currently deployed. This is a safe way to check what will happen once we run `cdktf deploy` and is always good practice:

```
cdktf diff
```

Output should look like the following:

```text
cdk-workshop  Terraform used the selected providers to generate the following execution
              plan. Resource actions are indicated with the following symbols:
                - destroy

              Terraform will perform the following actions:
cdk-workshop    # aws_sns_topic.CdkWorkshopTopic_D368A42F will be destroyed
                # (because aws_sns_topic.CdkWorkshopTopic_D368A42F is not in configuration)
                - resource "aws_sns_topic" "CdkWorkshopTopic_D368A42F" {
                    - application_success_feedback_sample_rate = 0 -> null
                    - arn                                      = "arn:aws:sns:us-east-1:694710432912:vincent-topic" -> null
                    - content_based_deduplication              = false -> null
                    - fifo_topic                               = false -> null
                    - firehose_success_feedback_sample_rate    = 0 -> null
                    - http_success_feedback_sample_rate        = 0 -> null
                    - id                                       = "arn:aws:sns:us-east-1:694710432912:vincent-topic" -> null
                    - lambda_success_feedback_sample_rate      = 0 -> null
                    - name                                     = "vincent-topic" -> null
                    - owner                                    = "694710432912" -> null
                    ...

                # aws_sqs_queue_policy.CdkWorkshopQueue_Policy_AF2494A5 will be destroyed
                # (because aws_sqs_queue_policy.CdkWorkshopQueue_Policy_AF2494A5 is not in configuration)
                - resource "aws_sqs_queue_policy" "CdkWorkshopQueue_Policy_AF2494A5" {
                    - id        = "https://sqs.us-east-1.amazonaws.com/694710432912/vincentcdk-workshopCdkWorkshopQueue20250714071913743900000002" -> null
                    - policy    = jsonencode(
                          {
                            - Statement = [
                                - {
                                    - Action    = "sqs:SendMessage"
                                    - Condition = {
                                        - ArnEquals = {
                                            - "aws:SourceArn" = "arn:aws:sns:us-east-1:694710432912:vincent-topic"
                                          }
                                      }
                                    - Effect    = "Allow"
                                    - Principal = {
                                        - Service = "sns.amazonaws.com"
                                      }
                                    - Resource  = "arn:aws:sqs:us-east-1:694710432912:vincentcdk-workshopCdkWorkshopQueue20250714071913743900000002"
                                  },
                              ]
                            - Version   = "2012-10-17"
                          }
                      ) -> null
                    - queue_url = "https://sqs.us-east-1.amazonaws.com/694710432912/vincentcdk-workshopCdkWorkshopQueue20250714071913743900000002" -> null
                  }

              Plan: 0 to add, 0 to change, 4 to destroy.

              ─────────────────────────────────────────────────────────────────────────────

              Saved the plan to: plan

              To perform exactly these actions, run the following command to apply:
                  terraform apply "plan"
```

As expected, all of our resources are going to be brutally destroyed.

## cdktf deploy

Run `cdktf deploy` and wait for a final `Approve`, then __proceed to the next section__

```
cdktf deploy
```

You should see the resources being deleted.

{{< nextprevlinks >}}