//Get all types
import * as types from './types';

// Get context type
import{ Context, APIGatewayEvent } from 'aws-lambda';


// Get validate email function
import { validateEmail } from './utils/validateEmail';


// Get DynamoDB table name from env variables
const tableName = process.env.USER_TABLE_NAME;

//Create a DocumentClient
const dynamodb = require('aws-sdk/clients/dynamodb')
const documentClient = new dynamodb.DocumentClient();

// Get method which returns all user info from the DynamoDB table
exports.getUserLambdaHandler = async (event: APIGatewayEvent, context: Context) => {
    // Logs to CloudWatch
    console.info('Received request to get user:', context, event);

    if(!tableName){
        const error = "Table name is undefined"
        console.error(error, context);
        throw new Error(error);
    };

    if(!event.queryStringParameters?.email_address){
        const error = "email_address is undefined, it is a required query string"
        console.error(error, context);
        throw new Error(error);
    };

    const email_address = event.queryStringParameters.email_address;
    const validEmail = validateEmail(email_address);

    if (!validEmail){
        const error = "email_address is invalid, ensure a valid email address is being queried"
        console.error(error, context);
        throw new Error(error);
    };

    var params = {
        TableName: tableName,
        Key: event.queryStringParameters
    };
    
    try{
        const data = await documentClient.get(params).promise();
        const item = data.Item;

        const response = {
            statusCode: 200,
            body: JSON.stringify(item)
        };
    
        //Logs to CloudWatch
        console.info(`response from: ${context.clientContext?.client} statusCode: ${response.statusCode} body: ${response.body}`);
        
        return response;
    
    } catch (err){
        throw err;
    }
}