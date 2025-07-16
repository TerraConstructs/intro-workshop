---
title: "TerraConstructs - AWS Intro Workshop"
chapter: true
weight: 1
---
![](/images/favicon.png)
{.right-aligned}

# Welcome Developers!

Hey there, and thanks for joining us! Hope you can't wait to play
with this new thing we call "TerraConstructs" inspired by AWSCDK and
built on top of "Cloud Development Kit for Terraform" or in short,
CDKTF!

Combined, this is a new software development framework with the sole purpose
of making it fun and easy to define cloud infrastructure in your favorite
programming language and deploy it using Terraform.

So what are we going to build? Nothing too fancy...

We'll spend some time setting up your development environment and learning a
little about how to work using CDKTF in combination with TerraConstructs
to deploy your app to an AWS environment.

Then, you'll write a little "Hello, world" Lambda function and front it with an
API Gateway endpoint so users can call it via an HTTP request.

Next, we'll introduce the powerful concept of __CDK Constructs__.
Constructs allow you to bundle up a bunch of infrastructure into reusable
components which anyone can compose into their apps. We'll walk you through
writing your own construct.

Finally, we'll show you how to use a construct from a pre-packaged library in your
stack.

By the end of this workshop, you'll be able to:

- Create new CDKTF applications.
- Define your app's infrastructure using the TerraConstructs library
- Deploy your CDKTF apps to your AWS account
- Define your own reusable constructs
- Consume constructs published by other

You can also find a short guide on utilizing our [Construct Hub](./70-construct-hub.html) at the end of this workshop. This will be a useful tool for all future endeavors with the CDKs.

## See Also

- [CDK for Terraform](https://developer.hashicorp.com/terraform/cdktf)
- [TerraConstructs](https://terraconstructs.dev)
- [AWS CDK User Guide](https://docs.aws.amazon.com/CDK/latest/userguide) (TerraConstructs is heavily based on AWS CDK.)
- [AWS CDK Reference](https://docs.aws.amazon.com/cdk/api/latest/docs/aws-construct-library.html)
