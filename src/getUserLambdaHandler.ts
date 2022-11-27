//Get all types
import * as types from './types';

// Get context type
import{ Context, APIGatewayEvent } from 'aws-lambda';



// Get DynamoDB table name from env variables
const tableName = process.env.USER_TABLE_NAME;

//Create a DocumentClient
const dynamodb = require('aws-sdk/clients/dynamodb')
const documentClient = new dynamodb.DocumentClient();

// Get method which returns all user info from the DynamoDB table
exports.getUserLambdaHandler = async (event: APIGatewayEvent, context: Context) => {
    // Logs to CloudWatch
    console.info('Received request to get user:', context, event)

    var params = {
        TableName: tableName,
        Key: event.queryStringParameters
    }

    const data = await documentClient.get(params).promise();
    const item = data.Item;

    const response = {
        statusCode: 200,
        body: JSON.stringify(item)
    }

    //Logs to CloudWatch
    console.info(`response from: ${context.clientContext?.client} statusCode: ${response.statusCode} body: ${response.body}`)
    
    return response
}