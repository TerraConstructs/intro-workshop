+++
title = "API Gateway"
weight = 400
+++

Next step is to add an API Gateway in front of our function. API Gateway will
expose a public HTTP endpoint that anyone on the internet can hit with an HTTP
client such as [curl](https://curl.haxx.se/) or a web browser.

We will use [Lambda proxy
integration](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-create-api-as-simple-proxy-for-lambda.html)
mounted to the root of the API. This means that any request to any URL path will
be proxied directly to our Lambda function, and the response from the function
will be returned back to the user.

## Add a LambdaRestApi construct to your stack

Going back to `main.ts`, let's define an API endpoint and associate it with our Lambda function:

{{<highlight ts "hl_lines=8 16 23-27">}}
import { App } from "cdktf";
import { Construct } from "constructs";
import { AwsStack, AwsStackProps } from "terraconstructs/lib/aws";
import {
  Code,
  LambdaFunction,
  Runtime,
  LambdaRestApi,
} from "terraconstructs/lib/aws/compute";

class MyStack extends AwsStack {
  constructor(scope: Construct, id: string, props: AwsStackProps) {
    super(scope, id, props);

    // defines an AWS Lambda resource
    const hello = new LambdaFunction(this, "HelloHandler", {
      // functionNamePrefix: "your-hello-handler",
      runtime: Runtime.NODEJS_22_X,
      code: Code.fromAsset("lambda"),
      handler: "hello.handler",
    });

    // defines an API Gateway REST API resource backed by our "hello" function.
    new LambdaRestApi(this, "Endpoint", {
      handler: hello,
      registerOutputs: true,
    });
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

That's it. This is all you need to do in order to define an API Gateway which
proxies all requests to an AWS Lambda function.

## cdktf diff

Let's see what's going to happen when we deploy this:

```
cdktf diff
```

Output should look like this:

```text
cdk-workshop  Terraform used the selected providers to generate the following execution
              plan. Resource actions are indicated with the following symbols:
                + create

              Terraform will perform the following actions:
cdk-workshop    # aws_api_gateway_account.Endpoint_Account_B8304247 (Endpoint/Account) will be created
                + resource "aws_api_gateway_account" "Endpoint_Account_B8304247" {
                    + api_key_version     = (known after apply)
                    + cloudwatch_role_arn = (known after apply)
                    + features            = (known after apply)
                    + id                  = (known after apply)
                    + throttle_settings   = (known after apply)
                  }

                # aws_api_gateway_deployment.Endpoint_Deployment_318525DA (Endpoint/Deployment/Resource) will be created
                + resource "aws_api_gateway_deployment" "Endpoint_Deployment_318525DA" {
                    + created_date  = (known after apply)
                    + description   = "Automatically created by the RestApi construct"
                    + execution_arn = (known after apply)
                    + id            = (known after apply)
                    + invoke_url    = (known after apply)
                    + rest_api_id   = (known after apply)
                    + triggers      = {
                        + "redeployment" = "b66fffea26abdfc0e4889807f7ea0efd"
                      }
                  }

                ...

                # aws_lambda_permission.Endpoint_proxy_ANY_ApiPermissioncdk-workshopEndpoint424A4D39ANYproxy_628CE711 (Endpoint/Default/{proxy+}/ANY/ApiPermission.cdk-workshopEndpoint424A4D39.ANY..{proxy+}) will be created
                + resource "aws_lambda_permission" "Endpoint_proxy_ANY_ApiPermissioncdk-workshopEndpoint424A4D39ANYproxy_628CE711" {
                    + action              = "lambda:InvokeFunction"
                    + function_name       = "arn:aws:lambda:us-east-1:694710432912:function:cdk-workshop-dev-cdorkshopHelloHandler"
                    + id                  = (known after apply)
                    + principal           = "apigateway.amazonaws.com"
                    + source_arn          = (known after apply)
                    + statement_id        = (known after apply)
                    + statement_id_prefix = (known after apply)
                  }

              Plan: 14 to add, 0 to change, 0 to destroy.cdk-workshop

cdk-workshop  Changes to Outputs:
                + EndpointOutputs = {
                    + restApiId             = "xxxxxxxxxx"
                    + restApiName           = "cdkworkshopEndpoint424A4D39"
                    + restApiRootResourceId = "yyyyyyyy"
                    + url                   = "https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/prod/"
                  }

```

That's nice. This one line of code added 14 new resources to our stack.

## cdktf deploy

Okay, ready to deploy?

```
cdktf deploy --skip-synth
```

## Stack outputs

When deployment is complete, you'll notice this line:

```
cdk-workshop
  EndpointOutputs = {
    "restApiId": "xxxxxxxxxx",
    "restApiName": "cdkworkshopEndpoint424A4D39",
    "restApiRootResourceId": "yyyyyyyy",
    "url": "https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/prod/"
  }
```

This is a [Terraform output](https://developer.hashicorp.com/terraform/language/values/outputs) that's
added by the API Gateway construct when `registerOutputs` is enabled and includes the URL of the API Gateway endpoint.

## Testing your app

Let's try to hit this endpoint with `curl`. Copy the URL and execute (your
prefix and region will likely be different).

{{% notice info %}}
If you don't have [curl](https://curl.haxx.se/) installed, you can always use
your favorite web browser to hit this URL.
{{% /notice %}}

```
curl https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/prod/
```

Output should look like this:

```
Hello, CDKTF! You've hit /
```

You can also use your web browser for this:

![](./browser.png)

If this is the output you received, your app works!

## What if it didn't work?

If you received a 5xx error from API Gateway, it is likely one of two issues:

1. The response your function returned is not what API Gateway expects. Go back
   and make sure your handler returns a response that includes a `statusCode`,
   `body` and `header` fields (see [Write handler runtime
   code](./200-lambda.html)).
2. Your function failed for some reason. To debug this, you can quickly jump to [this section](../40-hit-counter/500-logs.html)
   to learn how to view your Lambda logs.

---

Good job! In the next chapter, we'll write our own reusable construct.

{{< nextprevlinks >}}