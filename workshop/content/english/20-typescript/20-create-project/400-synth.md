+++
title = "CDKTF synth"
weight = 400
+++

## Synthesize configuration from your app

CDKTF apps are effectively only a __definition__ of your infrastructure using
code. When CDKTF apps are executed, they produce (or "__synthesize__", in CDKTF
parlance) a Terraform configuration for each stack defined in your
application.

To synthesize a CDK app, use the `cdktf synth` command. Let's check out the
template synthesized from the sample app:

{{% notice info %}} The **CDKTF CLI** requires you to be in the same directory
as your `cdktf.json` file. If you have changed directories in your terminal,
please navigate back now.{{% /notice %}}

```
cdktf synth
```

Will output the following Terraform configuration:

```json
{
  "//": {
    "metadata": {
      "backend": "local",
      "stackName": "cdk-workshop",
      "version": "0.21.0"
    },
    "outputs": {
    }
  },
  "data": {
    "aws_caller_identity": {
      "CallerIdentity": {
        "//": {
          "metadata": {
            "path": "cdk-workshop/CallerIdentity",
            "uniqueId": "CallerIdentity"
          }
        },
        "provider": "aws"
      }
    },
    "aws_iam_policy_document": {
      "CdkWorkshopQueue_Policy_E8C1B641": {
        "//": {
          "metadata": {
            "path": "cdk-workshop/CdkWorkshopQueue/Policy/Policy/Resource",
            "uniqueId": "CdkWorkshopQueue_Policy_E8C1B641"
          }
        },
        "statement": [
          {
            "actions": [
              "sqs:SendMessage"
            ],
            "condition": [
              {
                "test": "ArnEquals",
                "values": [
                  "${aws_sns_topic.CdkWorkshopTopic_D368A42F.arn}"
                ],
                "variable": "aws:SourceArn"
              }
            ],
            "effect": "Allow",
            "principals": [
              {
                "identifiers": [
                  "${data.aws_service_principal.aws_svcp_default_region_sns.name}"
                ],
                "type": "Service"
              }
            ],
            "resources": [
              "${aws_sqs_queue.CdkWorkshopQueue_50D9D426.arn}"
            ]
          }
        ]
      }
    },
    "aws_partition": {
      "Partitition": {
        "//": {
          "metadata": {
            "path": "cdk-workshop/Partitition",
            "uniqueId": "Partitition"
          }
        },
        "provider": "aws"
      }
    },
    "aws_service_principal": {
      "aws_svcp_default_region_sns": {
        "//": {
          "metadata": {
            "path": "cdk-workshop/aws_svcp_default_region_sns}",
            "uniqueId": "aws_svcp_default_region_sns"
          }
        },
        "service_name": "sns"
      }
    }
  },
  "provider": {
    "aws": [
      {
        "region": "us-east-1"
      }
    ]
  },
  "resource": {
    "aws_sns_topic": {
      "CdkWorkshopTopic_D368A42F": {
        "//": {
          "metadata": {
            "path": "cdk-workshop/CdkWorkshopTopic/Resource",
            "uniqueId": "CdkWorkshopTopic_D368A42F"
          }
        },
        "tags": {
          "Name": "dev-CdkWorkshopTopic",
          "grid:EnvironmentName": "dev",
          "grid:UUID": "cdk-workshop-dev"
        }
      }
    },
    "aws_sns_topic_subscription": {
      "CdkWorkshopQueue_cdk-workshopCdkWorkshopTopicA7BCA841_F6BFFB7B": {
        "//": {
          "metadata": {
            "path": "cdk-workshop/CdkWorkshopQueue/cdk-workshopCdkWorkshopTopicA7BCA841/Resource",
            "uniqueId": "CdkWorkshopQueue_cdk-workshopCdkWorkshopTopicA7BCA841_F6BFFB7B"
          }
        },
        "depends_on": [
          "data.aws_iam_policy_document.CdkWorkshopQueue_Policy_E8C1B641",
          "aws_sqs_queue_policy.CdkWorkshopQueue_Policy_AF2494A5"
        ],
        "endpoint": "${aws_sqs_queue.CdkWorkshopQueue_50D9D426.arn}",
        "protocol": "sqs",
        "topic_arn": "${aws_sns_topic.CdkWorkshopTopic_D368A42F.arn}"
      }
    },
    "aws_sqs_queue": {
      "CdkWorkshopQueue_50D9D426": {
        "//": {
          "metadata": {
            "path": "cdk-workshop/CdkWorkshopQueue/Resource",
            "uniqueId": "CdkWorkshopQueue_50D9D426"
          }
        },
        "name_prefix": "cdk-workshop-dev-cdk-workshopCdkWorkshopQueue",
        "tags": {
          "Name": "dev-CdkWorkshopQueue",
          "grid:EnvironmentName": "dev",
          "grid:UUID": "cdk-workshop-dev"
        },
        "visibility_timeout_seconds": 300
      }
    },
    "aws_sqs_queue_policy": {
      "CdkWorkshopQueue_Policy_AF2494A5": {
        "//": {
          "metadata": {
            "path": "cdk-workshop/CdkWorkshopQueue/Policy/Resource",
            "uniqueId": "CdkWorkshopQueue_Policy_AF2494A5"
          }
        },
        "policy": "${data.aws_iam_policy_document.CdkWorkshopQueue_Policy_E8C1B641.json}",
        "queue_url": "${aws_sqs_queue.CdkWorkshopQueue_50D9D426.url}"
      }
    }
  },
  "terraform": {
    "backend": {
      "local": {
        "path": "<path-to-folder>/cdk-workshop/terraform.cdk-workshop.tfstate"
      }
    },
    "required_providers": {
      "aws": {
        "source": "aws",
        "version": "5.100.0"
      }
    }
  }
}
```

As you can see, this template includes four resources:

- **aws_sqs_queue** - our queue
- **aws_sns_topic** - our topic
- **aws_sns_topic_subscriptionn** - the subscription between the queue and the topic
- **aws_sqs_queue_policy** - the IAM policy which allows this topic to send messages to the queue

{{% notice info %}} **metadata** is automatically added per resource by the toolkit
to every stack to ease analysis. Terraform ignores the metadata in diff views
{{% /notice %}}

{{< nextprevlinks >}}