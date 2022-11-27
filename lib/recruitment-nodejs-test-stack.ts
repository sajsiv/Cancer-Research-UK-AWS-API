import { Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Function, Runtime, Code } from "aws-cdk-lib/aws-lambda";
import { RestApi, LambdaIntegration } from "aws-cdk-lib/aws-apigateway";

export class RecruitmentNodejsTestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    //Dynamodb table
    const userTable = new Table(this, "users", {
      partitionKey: {name: "email_address", type: AttributeType.STRING}
    });

    //Lamda function (get user data by email acdress)
    const getUserLambda = new Function(this, "GetUserLambdaHandler", {
      runtime: Runtime.NODEJS_16_X,
      code: Code.fromAsset("src"),
      handler: "getUserLambdaHandler.getUserLambdaHandler",
      environment: {
        USER_TABLE_NAME: userTable.tableName,
      }
    });
    
    // Giving the getUserLambda permissions to read and write to our dynamo table
    userTable.grantReadWriteData(getUserLambda);


    //Lambda function (post new user)
    const postUserLambda = new Function(this, "PostUserLambdaHandler", {
      runtime: Runtime.NODEJS_16_X,
      code: Code.fromAsset("src"),
      handler: "postUserLambdaHandler.postUserLambdaHandler",
      environment: {
        USER_TABLE_NAME: userTable.tableName,
      }
    });

    // Giving the postUserLambda permissions to read and write to our dynamo table
    userTable.grantReadWriteData(postUserLambda);


    // Lambda function (post donation)
    const postDonationLambda = new Function(this, "PostDonationLambdaHandler", {
      runtime: Runtime.NODEJS_16_X,
      code: Code.fromAsset("src"),
      handler: "postDonationLambdaHandler.postDonationLambdaHandler",
      environment: {
        USER_TABLE_NAME: userTable.tableName,
      }
    });

    // Giving the postUserLambda permissions to read and write to our dynamo table
    userTable.grantReadWriteData(postDonationLambda);

    // create the API gateway
    const api = new RestApi(this, "donation-api");
    api.root.resourceForPath("users").addMethod("GET", new LambdaIntegration(getUserLambda));
    api.root.resourceForPath("users").addMethod("POST", new LambdaIntegration(postUserLambda));
    api.root.resourceForPath("donations").addMethod("POST", new LambdaIntegration(postDonationLambda));

    new CfnOutput(this, "API URL", {
      value: api.url ?? "Error"
    })
  }
}
