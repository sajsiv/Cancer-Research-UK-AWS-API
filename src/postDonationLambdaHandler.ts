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

    console.info("Attempting to post  " + donation_info + " to " + email_address);

    var params = {
        TableName: tableName,
        Key: {email_address: email_address},
        UpdateExpression: "SET donations = list_append(donations, :vals)",
        ExpressionAttributeValues: {
          ":vals": [donation_info]
        },
        ReturnValues: "ALL_NEW"    
    }

    const data = await documentClient.update(params).promise();

    const response = {
        statusCode: 200,
        body: JSON.stringify(data.Attributes)
    }

    //Logs to CloudWatch
    console.info(`response from: ${context.clientContext?.client} statusCode: ${response.statusCode} body: ${response.body}`)
    
    return response
}