+++
title = "TerraConstructs"
weight = 350
+++

## Install TerraConstructs

Let's convert `MyStack` from extending basic `TerraformStack` to extend a more powerful AWS specific `AwsStack`.

First, install the [terraconstructs.dev](https://terraconstructs.dev) package into the workshop.

```terminal
npm install terraconstructs
```

Now, Replace the `TerraformStack` from `cdktf` with TerraConstruct's `AwsStack`.

This requires us to provide additional metadata such as:

- **environmentName**: A user friendly description of the environment we are deploying into.
- **gridUUID**: A Unique Identity that is decoupled from environment name or product/component identity.
- **providerConfig**: AWS configuration such as `region`.

{{<highlight ts "hl_lines=1 3 5-7 14-20">}}
import { App } from "cdktf";
import { Construct } from "constructs";
import { AwsStack, AwsStackProps } from "terraconstructs/lib/aws";

class MyStack extends AwsStack {
  constructor(scope: Construct, id: string, props: AwsStackProps) {
    super(scope, id, props);

    // define resources here
  }
}

const app = new App();
new MyStack(app, "cdk-workshop", {
  environmentName: "dev",
  gridUUID: "cdk-workshop-dev", // Ideally this is an autogenated UUID instead
  providerConfig: {
    region: "us-east-1",
  },
});
app.synth();
{{</highlight>}}

## AWS Resources

We are now ready to use following powerful features from the TerraConstructs `aws/notify` module:

- SQS Queue (`new Queue`)
- SNS Topic (`new Topic`)
- Subscribe the queue to receive any messages published to the topic (`topic.addSubscription`)

{{<highlight ts "hl_lines=3 5 11-17">}}
import { App } from "cdktf";
import { Construct } from "constructs";
import { Duration } from "terraconstructs/lib";
import { AwsStack, AwsStackProps } from "terraconstructs/lib/aws";
import { Queue, Topic, subscriptions } from "terraconstructs/lib/aws/notify";

class MyStack extends AwsStack {
  constructor(scope: Construct, id: string, props: AwsStackProps) {
    super(scope, id, props);

    const queue = new Queue(this, "CdkWorkshopQueue", {
      visibilityTimeoutSeconds: Duration.minutes(5).toSeconds(),
    });

    const topic = new Topic(this, "CdkWorkshopTopic");
    topic.addSubscription(new subscriptions.SqsSubscription(queue));
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

## Shared AWS Account

{{% notice danger %}} Workshops ran on shared AWS Accounts require identifiers to avoid name conflicts{{% /notice %}}

Use the `topicName` or `namePrefix` properties to make your resource identities unique:

{{<highlight ts "hl_lines=12 16-18">}}
import { App } from "cdktf";
import { Construct } from "constructs";
import { Duration } from "terraconstructs/lib";
import { AwsStack, AwsStackProps } from "terraconstructs/lib/aws";
import { Queue, Topic, subscriptions } from "terraconstructs/lib/aws/notify";

class MyStack extends AwsStack {
  constructor(scope: Construct, id: string, props: AwsStackProps) {
    super(scope, id, props);

    const queue = new Queue(this, "CdkWorkshopQueue", {
      namePrefix: "vincent",
      visibilityTimeoutSeconds: Duration.seconds(300).toSeconds(),
    });

    const topic = new Topic(this, "CdkWorkshopTopic", {
      topicName: "vincent-topic",
    });
    topic.addSubscription(new subscriptions.SqsSubscription(queue));
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

{{< nextprevlinks >}}