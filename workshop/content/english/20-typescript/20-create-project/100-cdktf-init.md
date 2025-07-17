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

We will use `cdktf init` to create a new TypeScript CDKTF project:

```
cdktf init --template=typescript --local
```

Output should look like this (you can safely ignore warnings about
initialization of a git repository, this probably means you don't have git
installed, which is fine for this workshop):

```
Note: By supplying '--local' option you have chosen local storage mode
for storing the state of your stack. This means that your Terraform state
file will be stored locally on disk in a file 'terraform.<STACK NAME>.tfstate'
in the root of your project.

? Project Name (cdk-workshop)
```

{{% notice danger %}}
Workshops ran on shared AWS Accounts must use unique `Project Name` for each attendee to avoid name conflicts.
{{% /notice %}}

Confirm the prompts:

- Project Name `↩`
- Project Description `↩`
- Do you want to start from an existing Terraform project? `↩`
- Do you want to send crash reports to the CDKTF team? `↩`

  Refer to [crash reporting](https://developer.hashicorp.com/terraform/cdktf/create-and-deploy/configuration-file#enable-crash-reporting-for-the-cli) for more information

- What providers do you want to use? `↩` (none)

```
added 2 packages, and audited 102 packages in 3s
...
========================================================================================================

  Your CDKTF TypeScript project is ready!

  cat help                Print this message

  Compile:
    npm run get           Import/update Terraform providers and modules (you should check-in this directory)
    npm run compile       Compile typescript code to javascript (or "npm run watch")
    npm run watch         Watch for changes and compile typescript in the background
    npm run build         Compile typescript

  Synthesize:
    cdktf synth [stack]   Synthesize Terraform resources from stacks to cdktf.out/ (ready for 'terraform apply')

  Diff:
    cdktf diff [stack]    Perform a diff (terraform plan) for the given stack

  Deploy:
    cdktf deploy [stack]  Deploy the given stack

  Destroy:
    cdktf destroy [stack] Destroy the stack

  Test:
    npm run test        Runs unit tests (edit __tests__/main-test.ts to add your own tests)
    npm run test:watch  Watches the tests and reruns them on change

  Upgrades:
    npm run upgrade        Upgrade cdktf modules to latest version
    npm run upgrade:next   Upgrade cdktf modules to latest "@next" version (last commit)

 Use Providers:

  You can add prebuilt providers (if available) or locally generated ones using the add command:

  cdktf provider add "aws@~>3.0" null kreuzwerker/docker

  You can find all prebuilt providers on npm: https://www.npmjs.com/search?q=keywords:cdktf
  You can also install these providers directly through npm:

  npm install @cdktf/provider-aws
  npm install @cdktf/provider-google
  npm install @cdktf/provider-azurerm
  npm install @cdktf/provider-docker
  npm install @cdktf/provider-github
  npm install @cdktf/provider-null

  You can also build any module or provider locally. Learn more https://cdk.tf/modules-and-providers

========================================================================================================
```

As you can see, it shows us a bunch of useful commands to get us started.

## See Also

- [CDKTF Command Line Toolkit (cdktf) in the Terraform CDK User Guide](https://developer.hashicorp.com/terraform/tutorials/cdktf/cdktf-install)

{{< nextprevlinks >}}