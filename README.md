### Installation

Install the following:
  - "aws-cdk": "2.51.1",
  - "jest": "^26.4.2",
  - "ts-jest": "^26.2.0",
  - "ts-node": "^9.0.0",
  - "typescript": "~3.9.7"

Run npm install to get the rest of the dependencies

- npm run build
- cdk synth
- cdk deploy --parameters fromEmail=example@example.com

### API

URL: https://hctdhi0jib.execute-api.us-east-1.amazonaws.com/prod/

There are 3 routes

/users (GET)
- send off a GET request with a query parameter to get a single users data
- e.g. /users?email_address=example@example.com
- uses the getUserLambdaHandler

/users (POST)
- send off a POST request with a user JSON to post a new user
- JSON must be of the following form
{
    "user": {
        "email_address": "example@example.com",
        "donations": []
    }
}
- uses the postUserLambdaHandler

/donations (POST)
- send off a POST request with a donation JSON to post a new donation
- JSON must be of the following form
{
    "donation": {
        "email_address": "example@example.com",
        "amount": "4"
    }
}
- uses the postDonationLambdaHandler

### Scaling

Lambda has a limit of 1000 concurrent executions, which are the number of servers processing the requests. The exact amount of calls depends on the length of each execution. If a request takes 1ms, the upper limit is a million requests a second. However, these requests take much longer, especialling posting and sending a new users. The limit is closer to 1000 requests a second.

Regardless of this, API Gateway also puts a limit of 1000 requests a second being received at a steady rate.

Although these are hard limits, it is unlikely the app will have to process so many requests in such a sort amount of time. However, during fundraising events (e.g. TV shows raising money for CRUK) this may cause an issue. API Gateway has a seperate burst limit of 5000 requests a second for unusual high demand, this may be able to handle these spikes in requests.

AWS SES is the largest challenge to scaling. At the moment it is in sandbox mode, so it can only send and receive emails from my email address. The AWS support team need to verify the application before allowing it out of sandbox mode, allowing it to send automated emails.

### Logging

To make the logging more suitable for large scale production, I would make the logs structure more consistent. There should be the same ordering of variables (consistent formatting), e.g. message, context, error. This allows easier searching and easier integration when an application needs to consume log data from a different one. It also improves readibility when the logs have to be investigated.

### Unfinished

I did not get around to writing tests, although they are very valuable. This is my first AWS project, it was challenging but I learnt loads whilst getting it done!
