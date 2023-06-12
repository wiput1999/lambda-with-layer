import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import path = require("path");

export class LambdaWithLayerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const otelLayer = lambda.LayerVersion.fromLayerVersionArn(
      this,
      "otel-layer",
      `arn:aws:lambda:${this.region}:901920570463:layer:aws-otel-nodejs-amd64-ver-1-12-0:1`
    );

    const layer1 = new lambda.LayerVersion(this, "example-layer-1", {
      compatibleRuntimes: [
        lambda.Runtime.NODEJS_14_X,
        lambda.Runtime.NODEJS_16_X,
      ],
      code: lambda.Code.fromAsset("src/layer1"),
      description: "Example Layer 1",
    });

    const layer2 = new lambda.LayerVersion(this, "example-layer-2", {
      compatibleRuntimes: [
        lambda.Runtime.NODEJS_14_X,
        lambda.Runtime.NODEJS_16_X,
      ],
      code: lambda.Code.fromAsset("src/layer2"),
      description: "Example Layer 2",
    });

    // 👇 Lambda function
    new NodejsFunction(this, "example-function", {
      memorySize: 1024,
      timeout: cdk.Duration.seconds(5),
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: "handler",
      entry: path.join(__dirname, `/../src/app/index.js`),
      environment: {
        AWS_LAMBDA_EXEC_WRAPPER: "/opt/otel-handler",
        NODE_OPTIONS: "--require /opt/instrumentation.js",
      },
      layers: [otelLayer, layer1, layer2],
    });
  }
}
