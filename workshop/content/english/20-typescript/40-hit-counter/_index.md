+++
title = "Writing constructs"
bookFlatSection = true
weight = 40
+++

# Writing constructs

Writing custom CDK constructs allows you to tailor CDKTF to your specific needs, enabling customization, reusability, and modularity.

Writing your own CDK constructs can enable:

- **Customization**: Create constructs that reflect your organization's unique infrastructure patterns, making it easier to manage and maintain your cloud resources.
- **Reusability**: Reuse across multiple projects and environments, reducing the effort required to define and manage infrastructure, increasing consistency across your organization.
- **Modularity**: Break down of complex infrastructure into smaller constructs, allowing you to more easily manage and update individual components without affecting the entire infrastructure.
- **Improved security and compliance**: Create constructs that incorporate your security and compliance best practices, to ensure your infrastructure meets specific requirements and regulations.
- **Faster development**: Accelerate infrastructure development by reusing pre-built components, reducing the time and effort required to define and deploy resources.

{{% notice info %}} The TerraConstructs library is simply a carefully crafted library of CDKTF Constructs for specific Cloud Providers such as AWS. You may leverage these Constructs to build even more powerful and flexible infrastructure for your deployments.
{{% /notice %}}

In this chapter, we will define a custom CDK construct called `HitCounter` that takes a Lambda function as a property. This custom construct deploys resources that monitors the number hits on a URL. The resources defined in this custom construct includes an AWS Lambda function and an Amazon DynamoDB table.

![](/images/hit-counter.png)


## See Also

- [CDK for Terraform Concepts: Constructs](https://developer.hashicorp.com/terraform/cdktf/concepts/constructs)
- [Developing Custom Constructs (CDKTF)](https://developer.hashicorp.com/terraform/cdktf/develop-custom-constructs/construct-design)

{{< nextprevlinks >}}