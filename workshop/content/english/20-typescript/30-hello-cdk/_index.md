+++
title = "Hello, CDKTF!"
bookFlatSection = true
weight = 30
+++

# Hello, CDKTF!

In this chapter, we will finally write some CDKTF code. Instead of the SNS/SQS
code that we have in our app now, we'll add a Lambda function with an API
Gateway endpoint in front of it.

Users will be able to hit any URL in the endpoint and they'll receive a
heartwarming greeting from our function.

![](/images/hello-arch.png)

First, let's clean up the sample code.

{{< nextprevlinks >}}