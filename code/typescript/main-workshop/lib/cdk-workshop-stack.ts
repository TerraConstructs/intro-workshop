import type { App } from 'cdktf';
import * as aws from 'terraconstructs/lib/aws';
import * as compute from 'terraconstructs/lib/aws/compute';
import { HitCounter } from './hitcounter';
// TODO: Convert for TableViewer
// https://github.com/cdklabs/cdk-dynamo-table-viewerW
import { TableViewer } from 'cdk-dynamo-table-viewer';

export class CdkWorkshopStack extends aws.AwsStack {
  constructor(scope: App, id: string, props: aws.AwsStackProps) {
    super(scope, id, props);

    const hello = new compute.NodejsFunction(this, 'HelloHandler', {
      runtime: "nodejs18.x",
      // TODO: Add support for Code.fromAsset
      code: compute.Code.fromAsset('lambda'),
      handler: 'hello.handler',

    });

    const helloWithCounter = new HitCounter(this, 'HelloHitCounter', {
      downstream: hello
    });

    // TODO: Add support for apigw
    // defines an API Gateway REST API resource backed by our "hello" function.
    new compute.LambdaRestApi(this, 'Endpoint', {
      handler: helloWithCounter.handler
    });

    new TableViewer(this, 'ViewHitCounter', {
      title: 'Hello Hits',
      table: helloWithCounter.table,
      sortBy: '-hits'
    });
  }
}
