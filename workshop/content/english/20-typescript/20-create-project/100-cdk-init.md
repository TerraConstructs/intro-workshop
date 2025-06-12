+++
title = "CDKTF init"
weight = 100
+++

## Create project directory

Create an empty directory on your system:

```
mkdir cdk-workshop && cd cdk-workshop
```

## CDKTF init

We will use `cdktf init` to create a new TypeScript-CDKTF project:

```
cdktf init sample-app --language typescript
```

Output should look like this (you can safely ignore warnings about
initialization of a git repository, this probably means you don't have git
installed, which is fine for this workshop):

```
Applying project template app for typescript
Initializing a new git repository...
Executing npm install...
npm notice created a lockfile as package-lock.json. You should commit this file.
npm WARN tst@0.1.0 No repository field.
npm WARN tst@0.1.0 No license field.

# Welcome to your CDKTF TypeScript project!

You should explore the contents of this project. It demonstrates a CDK app with an instance of a stack (`CdktfWorkshopStack`)
which contains an Amazon SQS queue that is subscribed to an Amazon SNS topic.

The `cdktf.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

 * `npm run build`     compile typescript to js
 * `npm run watch`     watch for changes and compile
 * `npm run test`      perform the jest unit tests
 * `cdktf deploy`      deploy this stack to your default region
 * `cdktf diff`        compare deployed stack with current state
 * `cdktf synth`       emits the synthesized CloudFormation template
```

As you can see, it shows us a bunch of useful commands to get us started.

## See Also

- [CDKTF Command Line Toolkit (cdktf) in the Terraform CDK User Guide](https://developer.hashicorp.com/terraform/tutorials/cdktf/cdktf-install)

{{< nextprevlinks >}}