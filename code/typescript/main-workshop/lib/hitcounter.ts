import { Construct } from 'constructs';
import {
  Code,
  LambdaFunction,
  IFunction,
  Runtime,
} from 'terraconstructs/lib/aws/compute';
import { AttributeType, Table } from 'terraconstructs/lib/aws/storage';

export interface HitCounterProps {
  /** the function for which we want to count url hits **/
  downstream: IFunction;
}

export class HitCounter extends Construct {
  /** allows accessing the counter function */
  public readonly handler: LambdaFunction;

  /** the hit counter table */
  public readonly table: Table;

  constructor(scope: Construct, id: string, props: HitCounterProps) {
    super(scope, id);

    const table = new Table(this, 'Hits', {
      partitionKey: { name: 'path', type: AttributeType.STRING },
    });
    this.table = table;

    this.handler = new LambdaFunction(this, 'HitCounterHandler', {
      runtime: Runtime.NODEJS_22_X,
      handler: 'hitcounter.handler',
      code: Code.fromAsset('lambda'),
      environment: {
        DOWNSTREAM_FUNCTION_NAME: props.downstream.functionName,
        HITS_TABLE_NAME: table.tableName,
      },
    });

    // grant the lambda role read/write permissions to our table
    table.grantReadWriteData(this.handler);

    // grant the lambda role invoke permissions to the downstream function
    props.downstream.grantInvoke(this.handler);
  }
}
