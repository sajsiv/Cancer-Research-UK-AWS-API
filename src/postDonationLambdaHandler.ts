//Get all types
import * as types from './types';

// Get context type
import{ Context, APIGatewayEvent } from 'aws-lambda';


// Validate email function
import { validateEmail } from './utils/validateEmail';

// Get DynamoDB table name from env variables
const tableName = process.env.USER_TABLE_NAME;

//Create a DocumentClient
const dynamodb = require('aws-sdk/clients/dynamodb')
const documentClient = new dynamodb.DocumentClient();

// Get method which returns all user info from the DynamoDB table
exports.postDonationLambdaHandler = async (event: APIGatewayEvent, context: Context) => {
    // Logs to CloudWatch
    console.info( 'Received request to post donation:', context, event);

    const body: types.PostDonationEvent = JSON.parse(event.body? event.body : "StatusCode: 204 body: null");
    const donation = body.donation;
    const email_address = donation.email_address;
    const amount = donation.amount;
    
    console.info( 'Body email:', email_address);
    console.info( 'Body donation:', donation);

    const donation_date = new Date().toUTCString()
    const donation_info = {
        date: donation_date,
        amount: amount
    }

    console.info("Attempting to post date:" + donation_info.date + " and donation amount: " + donation_info.amount + " to " + email_address);

    if(!tableName){
        const error = "Table name is undefined"
        console.error(error, context);
        throw new Error(error);
    };

    if(!donation){
        const error = "donation is undefined, the email address and amount must be packed in a donation object when posting a new donation"
        console.error(error, context);
        throw new Error(error);
    }

    if(!amount){
        const error = "amount is invalid, it is a required when posting a new donation"
        console.error(error, context);
        throw new Error(error);
    }

    if(!email_address){
        const error = "email_address is undefined, it is a required when posting a new donation"
        console.error(error, context);
        throw new Error(error);
    };

    const validEmail = validateEmail(email_address);

    if (!validEmail){
        const error = "email_address is invalid, ensure a valid email address is being sent when making a new notation"
        console.error(error, context);
        throw new Error(error);
    };

    var params = {
        TableName: tableName,
        Key: {email_address: email_address},
        UpdateExpression: "SET donations = list_append(donations, :vals)",
        ExpressionAttributeValues: {
          ":vals": [donation_info]
        },
        ReturnValues: "ALL_NEW"    
    }


    try{
        const data = await documentClient.update(params).promise();

        const response = {
            statusCode: 200,
            body: JSON.stringify(data.Attributes)
        }
    
        //Logs to CloudWatch
        console.info(`response from: ${context.clientContext?.client} statusCode: ${response.statusCode} body: ${response.body}`)
        
        return response
    
    }catch (err){
        console.error(err);
        throw err;
    }
}