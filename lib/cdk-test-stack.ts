import * as cdk from 'aws-cdk-lib';

import { Construct } from 'constructs';
import {PipelineAppStage} from './stage'
import { CodePipeline, CodePipelineSource, ManualApprovalStep, ShellStep } from 'aws-cdk-lib/pipelines';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkTestStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, 'Pipeline', {
      pipelineName: 'TestPipeline',
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub('sashinshin/aws-cdk-test', 'main'),
        commands: ['npm ci',
          'npm run build',
          'npx cdk synth'],
      }),
    });

    const testingStage = pipeline.addStage(new PipelineAppStage(this, 'test', {
      env: { account: '832619390022', region: 'eu-west-1' },
    }))

    testingStage.addPost(new ManualApprovalStep('Manual approval befire production'))

    const prodStage = pipeline.addStage(new PipelineAppStage(this, 'prod', {
      env: { account: '832619390022', region: 'eu-west-1' },
    }))


  }
}
