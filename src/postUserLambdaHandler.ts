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
exports.postUserLambdaHandler = async (event: APIGatewayEvent, context: Context) => {
    // Logs to CloudWatch
    console.info( 'UTC: [', (new Date()).toUTCString, '] Received request to get user:', context, event);

    const body: types.PostUserEvent = JSON.parse(event.body? event.body : "StatusCode: 204 body: null");
    const user = body.user
    const email_address = user.email_address;
    user.donations = [];
    
    console.info( 'UTC: [', (new Date()).toUTCString, '] Body email:', email_address);


    if(!tableName){
        const error = "Table name is undefined"
        console.error(error, context);
        throw new Error(error);
    };

    
    if(!user){
        const error = "user is undefined, the email address and an empty donations array must be packed in a user object when posting a new user"
        console.error(error, context);
        throw new Error(error);
    }

    if(!email_address){
        const error = "email_address is undefined, it is a required when posting a new user"
        console.error(error, context);
        throw new Error(error);
    };

    const validEmail = validateEmail(email_address);

    if (!validEmail){
        const error = "email_address is invalid, ensure a valid email address is being posted"
        console.error(error, context);
        throw new Error(error);
    };

    var params = {
        TableName: tableName,
        Item: user
    }

    try {
        const data = await documentClient.put(params).promise();
    
        const response = {
            statusCode: 200,
            body: JSON.stringify(body)
        }
    
        //Logs to CloudWatch
        console.info(`response from: ${context.clientContext?.client} statusCode: ${response.statusCode} body: ${response.body}`)
        
        return response
    
    }catch (err){
        console.error(err, context);
        throw err;
    }
}