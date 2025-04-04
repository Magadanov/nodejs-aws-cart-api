import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dotenv from 'dotenv';

dotenv.config();

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const cartApiLambda = new lambda.Function(this, 'CartApiLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      functionName: 'cartApiLambda',
      handler: 'main.handler',
      code: lambda.Code.fromAsset('../dist'),
      environment: {
        NODE_ENV: 'AWS',
        AUTH_USERNAME: process.env.AUTH_USERNAME as string,
        AUTH_PASSWORD: process.env.AUTH_PASSWORD as string,
      },
    });

    const functionUrl = cartApiLambda.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
      cors: {
        allowedOrigins: ['*'],
        allowedMethods: [lambda.HttpMethod.ALL],
        allowedHeaders: ['*'],
      },
    });

    new cdk.CfnOutput(this, 'ApiUrl', {
      value: functionUrl.url ?? '',
    });
  }
}
