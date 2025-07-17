+++
title = "Testing Constructs"
weight = 100
bookCollapseSection = true

+++

## Testing Constructs (Optional)

The [CDK for Terraform Developer Guide](https://developer.hashicorp.com/terraform/cdktf/test/unit-tests) has a good guide on testing constructs.

<!-- For this section of the workshop we are going to use the [Fine-Grained Assertions](https://docs.aws.amazon.com/cdk/latest/guide/testing.html#testing_fine_grained) and [Validation](https://docs.aws.amazon.com/cdk/latest/guide/testing.html#testing_validation) type tests. -->

#### CDKTF assert Library

We will be using the CDKTF Jest Matchers throughout this section.
The library contains several helper functions for writing unit and integration tests.

{{% notice info %}}

More advanced [assertion helpers](https://github.com/TerraConstructs/base/blob/v0.1.0/test/assertions.ts) are available in TerraConstructs and may be published for easier set up in the future.

{{% /notice %}}

For this workshop we will mostly be using the `toHaveResource` and `toHaveResourceWithProperties` Jest matchers. This helper is used when you
only care that a resource of a particular type exists (regardless of its logical identfier), and that _some_
properties are set to specific values.

Example:

```ts
// NOTE: terraconstructs requires stack.prepareStack()
// due to many of its late binding features.
stack.prepareStack();
const template = Testing.synth(stack, runValidations)
expect(template).toHaveResourceWithProperties(instance.Instance, {
    ami: "ami-xxxxx",
    // Note: some properties omitted here
});

expect(template).not.toHaveResourceWithProperties(instance.Instance, {
    availability_zone: expect.anything(), // should not have this property set
});
```

To see the rest of the documentation, please read the docs [here](https://developer.hashicorp.com/terraform/cdktf/test/unit-tests#write-assertions).

{{< nextprevlinks >}}