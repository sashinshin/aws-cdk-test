import * as cdk from 'aws-cdk-lib';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { join } from 'path';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkTestStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new CodePipeline(this, 'Pipeline', {
      pipelineName:'TestPipeline',
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub('sashinshin/aws-cdk-test', 'main'),
        commands: ['npm ci', 'npm run build', 'npx cdk synth'],
      }),

    })

    const lambda = new NodejsFunction(this, "lambda", {
      description: "Lambda",
      handler: "handler",
      entry: join(__dirname, "../lambda/lambda/index.ts"),
      runtime: Runtime.NODEJS_14_X,
      timeout: cdk.Duration.seconds(30),
      environment: {
        ENV_VAR: "env-var",
      }
    });


    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'CdkTestQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
