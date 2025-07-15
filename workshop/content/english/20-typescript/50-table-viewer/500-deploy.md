+++
title = "Deploying our app"
weight = 500
+++

## cdktf diff

Before we deploy, let's take a look at what will happen when we deploy our app
(this is just the `Resources` section of the output):

```
$ cdktf diff
cdk-workshop  Terraform used the selected providers to generate the following execution
              plan. Resource actions are indicated with the following symbols:
cdk-workshop  + create

              Terraform will perform the following actions:

                # aws_api_gateway_account.ViewHitCounter_ViewerEndpoint_Account_0B75E76A (ViewHitCounter/ViewerEndpoint/Account) will be created
                + resource "aws_api_gateway_account" "ViewHitCounter_ViewerEndpoint_Account_0B75E76A" {
                    + api_key_version     = (known after apply)
                    + cloudwatch_role_arn = (known after apply)
                    + features            = (known after apply)
                    + id                  = (known after apply)
                    + throttle_settings   = (known after apply)
                  }

                # aws_api_gateway_deployment.ViewHitCounter_ViewerEndpoint_Deployment_1CE7C576 (ViewHitCounter/ViewerEndpoint/Deployment/Resource) will be created
                + resource "aws_api_gateway_deployment" "ViewHitCounter_ViewerEndpoint_Deployment_1CE7C576" {
                    + created_date  = (known after apply)
                    + description   = "Automatically created by the RestApi construct"
                    + execution_arn = (known after apply)
                    + id            = (known after apply)
                    + invoke_url    = (known after apply)
                    + rest_api_id   = (known after apply)
                    + triggers      = {
                        + "redeployment" = "2c0a96431a490394e62f6aa1253fcd32"
                      }
                  }

                # aws_api_gateway_integration.ViewHitCounter_ViewerEndpoint_ANY_Integration_0D82D209 (ViewHitCounter/ViewerEndpoint/Default/ANY/Integration) will be created
                + resource "aws_api_gateway_integration" "ViewHitCounter_ViewerEndpoint_ANY_Integration_0D82D209" {
                    + cache_namespace         = (known after apply)
                    + connection_type         = "INTERNET"
                    + http_method             = "ANY"
                    + id                      = (known after apply)
                    + integration_http_method = "POST"
                    + passthrough_behavior    = (known after apply)
                    + resource_id             = (known after apply)
                    + rest_api_id             = (known after apply)
                    + timeout_milliseconds    = 29000
                    + type                    = "AWS_PROXY"
                    + uri                     = (known after apply)
                  }

                  ...
                  # aws_lambda_permission.ViewHitCounter_ViewerEndpoint_proxy_ANY_ApiPermissionTestcdk-workshopViewHitCounterViewerEndpoint39EB6BA3ANYproxy_5F5DA8F5 (ViewHitCounter/ViewerEndpoint/Default/{proxy+}/ANY/ApiPermission.Test.cdk-workshopViewHitCounterViewerEndpoint39EB6BA3.ANY..{proxy+}) will be created
                + resource "aws_lambda_permission" "ViewHitCounter_ViewerEndpoint_proxy_ANY_ApiPermissionTestcdk-workshopViewHitCounterViewerEndpoint39EB6BA3ANYproxy_5F5DA8F5" {
                    + action              = "lambda:InvokeFunction"
                    + function_name       = (known after apply)
                    + id                  = (known after apply)
                    + principal           = "apigateway.amazonaws.com"
                    + source_arn          = (known after apply)
                    + statement_id        = (known after apply)
                    + statement_id_prefix = (known after apply)
                  }

                # aws_lambda_permission.ViewHitCounter_ViewerEndpoint_proxy_ANY_ApiPermissioncdk-workshopViewHitCounterViewerEndpoint39EB6BA3ANYproxy_D511D77E (ViewHitCounter/ViewerEndpoint/Default/{proxy+}/ANY/ApiPermission.cdk-workshopViewHitCounterViewerEndpoint39EB6BA3.ANY..{proxy+}) will be created
                + resource "aws_lambda_permission" "ViewHitCounter_ViewerEndpoint_proxy_ANY_ApiPermissioncdk-workshopViewHitCounterViewerEndpoint39EB6BA3ANYproxy_D511D77E" {
                    + action              = "lambda:InvokeFunction"
                    + function_name       = (known after apply)
                    + id                  = (known after apply)
                    + principal           = "apigateway.amazonaws.com"
                    + source_arn          = (known after apply)
                    + statement_id        = (known after apply)
                    + statement_id_prefix = (known after apply)
                  }

                # aws_s3_object.FileAsset_0_S3 (FileAsset_0_S3) will be created
                + resource "aws_s3_object" "FileAsset_0_S3" {
                    + acl                    = (known after apply)
                    + arn                    = (known after apply)
                    + bucket                 = "cdk-workshop-dev-694710432912-us-east-1"
                    + bucket_key_enabled     = (known after apply)
                    + checksum_crc32         = (known after apply)
                    + checksum_crc32c        = (known after apply)
                    + checksum_crc64nvme     = (known after apply)
                    + checksum_sha1          = (known after apply)
                    + checksum_sha256        = (known after apply)
                    + content_type           = (known after apply)
                    + etag                   = (known after apply)
                    + force_destroy          = false
                    + id                     = (known after apply)
                    + key                    = "d9cdd7bdd784d6248d9a68dc7b1e49029a879f67840bd9cd5a3fd41de8b64c15.zip"
                    + kms_key_id             = (known after apply)
                    + server_side_encryption = (known after apply)
                    + source                 = "assets/FileAsset_0/d9cdd7bdd784d6248d9a68dc7b1e49029a879f67840bd9cd5a3fd41de8b64c15/archive.zip"
                    + source_hash            = "d9cdd7bdd784d6248d9a68dc7b1e49029a879f67840bd9cd5a3fd41de8b64c15"
                    + storage_class          = (known after apply)
                    + tags_all               = (known after apply)
                    + version_id             = (known after apply)
                  }

              Plan: 19 to add, 0 to change, 0 to destroy.
```

You'll notice that the table viewer adds another API Gateway endpoint, a Lambda
function, permissions, outputs, all sorts of goodies.

{{% notice warning %}} Construct libraries are a very powerful concept. They
allow you to add complex capabilities to your apps with minimum effort. However,
you must understand that with great power comes great responsibility. Constructs
can add IAM permissions, expose data to the public or cause your application not
to function. We are working on providing you tools for protecting your app, and
identifying potential security issues with your stacks, but it is your
responsibility to understand how certain constructs that you use impact your
application, and to make sure you only use construct libraries from vendors you
trust  {{% /notice %}}

### cdktf deploy

```
$ cdktf deploy --skip-synth
...

cdk-workshop  EndpointOutputs = {
                "restApiId" = "xxxxxxxxx"
                "restApiName" = "cdkworkshopEndpoint424A4D39"
                "restApiRootResourceId" = "aaaaaaaaa"
                "url" = "https://xxxxxxxxx.execute-api.us-east-1.amazonaws.com/prod/"
              }
              ViewerEndpointOutputs = {
                "restApiId" = "yyyyyyyyy"
                "restApiName" = "cdkworkshopViewHitCounterViewerEndpoint39EB6BA3"
                "restApiRootResourceId" = "bbbbbbbbb"
                "url" = "https://yyyyyyyyy.execute-api.us-east-1.amazonaws.com/prod/"
              }
```

You'll see the viewer endpoint as an output.

### Viewing the hit counter table

Open your browser and browse to the hit counter viewer endpoint URL. You should
see something like this:

![](./viewer1.png)

### Send a few requests

Send a few more requests to your "hello" endpoint and monitor your hit counter
viewer. You should see the values update in real-time.

Use `curl` or your web browser to produce a few hits:

```
$ curl https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/prod/hit1
$ curl https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/prod/hit1
$ curl https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/prod/hit1
$ curl https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/prod/hit1
$ curl https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/prod/hoooot
$ curl https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/prod/hoooot
$ curl https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/prod/hit1
$ curl https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/prod/hit1
$ curl https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/prod/hit1
$ curl https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/prod/hit1
$ curl https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/prod/hoooot
$ curl https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/prod/hoooot
$ curl https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/prod/hit1
```

{{% notice tip %}}

**Interested in how the Table Viewer works?** It's easy to find out!
Hold **Ctrl** (or **Command**) and click on the `TableViewer`
identifier to navigate to its source code.

{{% /notice %}}

{{< nextprevlinks >}}