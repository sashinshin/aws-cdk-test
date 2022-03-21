
import * as cdk from 'aws-cdk-lib';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { join } from 'path';
import { CdkTestStack } from './cdk-test-stack';

export class LambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, stageName:string,  props?: cdk.StackProps) {
    super(scope, id, props);

    new NodejsFunction(this, "lambda", {
        description: "Lambda",
        handler: "handler",
        entry: join(__dirname, "../lambda/lambda/index.ts"),
        runtime: Runtime.NODEJS_14_X,
        timeout: cdk.Duration.seconds(30),
        environment: {
          STAGE_ENV: stageName,
        }
      });

  }
}



  