+++
title = "Terraform CLI"
weight = 550
+++

Next, we'll install the Terraform CLI. Terraform is a command-line utility
which allows you to apply the Terraform CDK generated configurations.

> NOTE: You may use [tenv](https://github.com/tofuutils/tenv?tab=readme-ov-file#installation) to manage multiple versions of `terraform`. Follow the installation instructions for your operating system.

Using `tenv`, download terraform 1.7.3 with the following command.

```
tenv terraform install 1.7.3
```

You can check the terraform version:

```
$ terraform --version
1.7.3
```

## See Also

- [Installing Terraform User Guide](https://developer.hashicorp.com/terraform/install)

{{< nextprevlinks >}}