import * as cdk from 'aws-cdk-lib';
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3Deploy from "aws-cdk-lib/aws-s3-deployment"
import { Construct } from 'constructs';
import {PipelineAppStage} from './stage'
import { CodePipeline, CodePipelineSource, ManualApprovalStep, ShellStep } from 'aws-cdk-lib/pipelines';
import { join } from 'path';

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

    const bucket = new s3.Bucket(this, 'cdk-test-bucket', {
      bucketName: "cdk-test-bucket-static-site",
      publicReadAccess: true,
      websiteIndexDocument: "index.html",
    });

    new s3Deploy.BucketDeployment(this, "BucketDeploy", {
      sources: [s3Deploy.Source.asset(join(__dirname, "../dist"))],
      destinationBucket: bucket,
    })

    const testingStage = pipeline.addStage(new PipelineAppStage(this, 'test', {
      env: { account: '832619390022', region: 'eu-west-1' },
    }))

    testingStage.addPost(new ManualApprovalStep('Manual approval befire production'))

    const prodStage = pipeline.addStage(new PipelineAppStage(this, 'prod', {
      env: { account: '832619390022', region: 'eu-west-1' },
    }))


  }
}
