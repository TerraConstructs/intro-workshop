+++
title = "CDKTF deploy"
weight = 500
+++

Okay, we've got a Terraform configuration. What's next? __Let's deploy it into our account!__

## Let's deploy

Use `cdktf deploy` to deploy a CDK app:

```
cdktf deploy
```

The Terraform configuration is first used to initialize `terraform`.

```
cdk-workshop  Initializing the backend...
cdk-workshop
              Successfully configured the backend "local"! Terraform will automatically
              use this backend unless the backend configuration changes.
cdk-workshop  Initializing provider plugins...
              - Finding hashicorp/aws versions matching "5.100.0"...
cdk-workshop  - Installing hashicorp/aws v5.100.0...
              ....


0 Stacks deploying     0 Stacks done     1 Stack waiting
```

Once initialised a `plan` will be presented

```text
Plan: 4 to add, 0 to change, 0 to destroy.

              Do you want to perform these actions?
                Terraform will perform the actions described above.
                Only 'yes' will be accepted to approve.

Please review the diff output above for cdk-workshop
❯ Approve  Applies the changes outlined in the plan.
  Dismiss
  Stop
```

These are the changes that Terraform will make to your infrastructure. Choose `Approve` to apply these changes.

Output should look like the following:

```
cdk-workshop  aws_sqs_queue.CdkWorkshopQueue_50D9D426: Creating...
cdk-workshop  aws_sns_topic.CdkWorkshopTopic_D368A42F: Creating...
cdk-workshop  aws_sns_topic.CdkWorkshopTopic_D368A42F: Creation complete after 3s [id=arn:aws:sns:us-east-1:694710432912:terraform-20250714065717423000000004]
cdk-workshop  aws_sqs_queue.CdkWorkshopQueue_50D9D426: Still creating... [10s elapsed]
cdk-workshop  aws_sqs_queue.CdkWorkshopQueue_50D9D426: Still creating... [20s elapsed]
cdk-workshop  aws_sqs_queue.CdkWorkshopQueue_50D9D426: Creation complete after 29s [id=https://sqs.us-east-1.amazonaws.com/694710432912/cdk-workshop-dev-cdk-workshopCdkWorkshopQueue20250714065717422700000003]
cdk-workshop  data.aws_iam_policy_document.CdkWorkshopQueue_Policy_E8C1B641 (CdkWorkshopQueue/Policy/Policy/Resource): Reading...
cdk-workshop  data.aws_iam_policy_document.CdkWorkshopQueue_Policy_E8C1B641 (CdkWorkshopQueue/Policy/Policy/Resource): Read complete after 0s [id=2163801131]
cdk-workshop  aws_sqs_queue_policy.CdkWorkshopQueue_Policy_AF2494A5: Creating...
cdk-workshop  aws_sqs_queue_policy.CdkWorkshopQueue_Policy_AF2494A5: Still creating... [10s elapsed]
cdk-workshop  aws_sqs_queue_policy.CdkWorkshopQueue_Policy_AF2494A5: Still creating... [20s elapsed]
cdk-workshop  aws_sqs_queue_policy.CdkWorkshopQueue_Policy_AF2494A5: Creation complete after 27s [id=https://sqs.us-east-1.amazonaws.com/694710432912/cdk-workshop-dev-cdk-workshopCdkWorkshopQueue20250714065717422700000003]
cdk-workshop  aws_sns_topic_subscription.CdkWorkshopQueue_cdk-workshopCdkWorkshopTopicA7BCA841_F6BFFB7B: Creating...
cdk-workshop  aws_sns_topic_subscription.CdkWorkshopQueue_cdk-workshopCdkWorkshopTopicA7BCA841_F6BFFB7B: Creation complete after 2s [id=arn:aws:sns:us-east-1:694710432912:terraform-20250714065717423000000004:54d605d3-7a64-457e-90bc-5929b2f688bc]
cdk-workshop
              Apply complete! Resources: 4 added, 0 changed, 0 destroyed.

No outputs found.
```

## The Terraform CLI

CDKTF apps are deployed through `terraform` CLI. Each CDKTF stack maps 1:1 with
a terraform folder under `cdktf.out/stacks/`.

This means that you can use the `terraform` CLI in order to manage
your stacks.

Let's take a look at the contents of the Terraform state.

You will likely see something like this:

```
cd cdktf.out/stacks/cdk-workshop
terraform state list
```

```text
data.aws_caller_identity.CallerIdentity
data.aws_iam_policy_document.CdkWorkshopQueue_Policy_E8C1B641
data.aws_partition.Partitition
data.aws_service_principal.aws_svcp_default_region_sns
aws_sns_topic.CdkWorkshopTopic_D368A42F
aws_sns_topic_subscription.CdkWorkshopQueue_cdk-workshopCdkWorkshopTopicA7BCA841_F6BFFB7B
aws_sqs_queue.CdkWorkshopQueue_50D9D426
aws_sqs_queue_policy.CdkWorkshopQueue_Policy_AF2494A5
```

To leverage powerful state management, learn more about [terraform here](https://developer.hashicorp.com/terraform).

This workshop is focused on defining the infrastructure.

# I am ready for some actual coding!

{{< nextprevlinks >}}