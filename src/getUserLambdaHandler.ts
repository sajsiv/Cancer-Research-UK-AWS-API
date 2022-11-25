//Get all types
import * as types from './types';

// Get context type
import{ Context } from 'aws-lambda';



// Get DynamoDB table name from env variables
const tableName = process.env.USER_TABLE_NAME;

//Create a DocumentClient
const dynamodb = require('aws-sdk/clients/dynamodb')
const documentClient = new dynamodb.DocumentClient();

// Get method which returns all user info from the DynamoDB table
exports.getUserLambdaHandler = async (event: types.GetUserByEmailEvent, context: Context) => {
    // Logs to CloudWatch
    console.info('Received request to get user:', context, event)

    var params = {
        TableName: tableName
    }

    const data = await documentClient.scan(params).promise();
    const items = data.Items;

    const response = {
        statusCode: 200,
        body: JSON.stringify(items)
    }

    //Logs to CloudWatch
    console.info(`response from: ${context.clientContext?.client} statusCode: ${response.statusCode} body: ${response.body}`)
    
    return response
}