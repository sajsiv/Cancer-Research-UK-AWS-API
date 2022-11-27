//Get all types
import * as types from './types';

// Get context type
import{ Context, APIGatewayEvent } from 'aws-lambda';
import { Identity } from 'aws-cdk-lib/aws-ses';
import { userInfo } from 'os';

// Get DynamoDB table name from env variables
const tableName = process.env.USER_TABLE_NAME;

//Create a DocumentClient
const dynamodb = require('aws-sdk/clients/dynamodb')
const documentClient = new dynamodb.DocumentClient();

// Get method which returns all user info from the DynamoDB table
exports.postUserLambdaHandler = async (event: APIGatewayEvent, context: Context) => {
    // Logs to CloudWatch
    console.info( 'UTC: [', (new Date()).toUTCString, '] Received request to get user:', context, event);

    const body: types.PostUserEvent = JSON.parse(event.body? event.body : "StatusCode: 204 body: null");
    const user = body.user
    const email_address = user.email_address;
    user.donations = [];
    
    console.info( 'UTC: [', (new Date()).toUTCString, '] Body email:', email_address);

    var params = {
        TableName: tableName,
        Item: user
    }

    const data = await documentClient.put(params).promise();
    const items = data.Items;

    const response = {
        statusCode: 200,
        body: JSON.stringify(body)
    }

    //Logs to CloudWatch
    console.info(`response from: ${context.clientContext?.client} statusCode: ${response.statusCode} body: ${response.body}`)
    
    return response
}