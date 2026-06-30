import { TableViewer } from '@tcons/cdk-dynamo-table-viewer';
import { Construct } from 'constructs';
import { AwsStack, AwsStackProps } from 'terraconstructs/lib/aws';
import {
  Code,
  LambdaFunction,
  LambdaRestApi,
  Runtime,
} from 'terraconstructs/lib/aws/compute';
import { HitCounter } from './hitcounter';

export class CdkWorkshopStack extends AwsStack {
  constructor(scope: Construct, id: string, props: AwsStackProps) {
    super(scope, id, props);

    // defines an AWS Lambda resource
    const hello = new LambdaFunction(this, 'HelloHandler', {
      runtime: Runtime.NODEJS_24_X,
      code: Code.fromAsset('lambda'),
      handler: 'hello.handler',
    });

    const helloWithCounter = new HitCounter(this, 'HelloHitCounter', {
      downstream: hello,
    });

    // defines an API Gateway REST API resource backed by our "hello" function.
    new LambdaRestApi(this, 'Endpoint', {
      cloudWatchRole: false,
      handler: helloWithCounter.handler,
      registerOutputs: true,
    });

    new TableViewer(this, 'ViewHitCounter', {
      title: 'Hello Hits',
      table: helloWithCounter.table,
    });
  }
}
