import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import path = require("path");

export class LambdaWithLayerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

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
    new NodejsFunction(this, "my-function", {
      memorySize: 1024,
      timeout: cdk.Duration.seconds(5),
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: "main",
      entry: path.join(__dirname, `/../src/app/index.ts`),
      bundling: {
        minify: false,
      },
      layers: [layer1, layer2],
    });
  }
}
