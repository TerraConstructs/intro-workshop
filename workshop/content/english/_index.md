---
title: "TerraConstructs - AWS Intro Workshop"
chapter: true
weight: 1
---
![](/images/favicon.png)
{.right-aligned}

# Foreword

July 17, 2025

This day marks exactly seven years since the public announcement of the AWS Cloud Development Kit (AWSCDK),
a brilliant piece of work that I've long admired for its elegance, sophistication, and bold vision.

Over the past year, I've been reimagining that same high level interface on top of Terraform. Primarily to
adapt it for environments where the original may not have gained traction. Sometimes due to tech stack 
limitations, team capabilities, or simply different tooling preferences.

This journey has only deepened my appreciation for the original team's meticulous design, and for Elad in
particular, who’s been a driving and visible force behind the project. While no one person builds something
this impactful alone, his contributions have clearly left a lasting imprint!

By bringing this design into another industry-shifting framework like Terraform, I hope to showcase its brilliance
and combine the strengths of both ecosystems. More importantly, I hope to make these core ideas more accessible to a broader audience and maybe even spark the same excitement I felt when I first worked through the original AWS CDK workshop myself.

Above all, I hope, the original team sees this as the sincerest form of flattery!

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
