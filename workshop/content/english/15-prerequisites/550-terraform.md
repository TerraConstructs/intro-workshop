+++
title = "Terraform CLI"
weight = 550
+++

Next, we'll install the Terraform CLI. Terraform is a command-line utility
which allows you to apply the Terraform CDK generated configurations.

{{% notice info %}} You may use [tenv](https://github.com/tofuutils/tenv?tab=readme-ov-file#installation) to manage multiple versions of `terraform` or [OpenTofu](https://opentofu.org/).
Follow the installation instructions for your operating system.{{% /notice %}}

Using `tenv`, download terraform 1.7.3 with the following command.

```
tenv terraform install 1.7.3
```

You can check the terraform version:

```
$ terraform --version
1.7.3
```

{{% notice info %}} When using `tenv`, best practice to set `TERRAFORM_BINARY_NAME` environment variable for CDKTF CLI.{{% /notice %}}

```
export TERRAFORM_BINARY_NAME=$(which terraform)
```

## See Also

- [Installing Terraform User Guide](https://developer.hashicorp.com/terraform/install)

{{< nextprevlinks >}}