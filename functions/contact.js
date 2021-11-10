'use strict';

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB();
const sns = new AWS.SNS();

module.exports.handler = function(event, context, callback) {
    console.log(event.body);
    const body = JSON.parse(event.body);

    const response = {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({})
    };

    var params = {
        Item: {
            "id": {
                S: body.id
            },
            "email": {
                S: body.email
            },
            "fullname": {
                S: body.fullname
            },
            "subject": {
                S: body.subject
            },
            "message": {
                S: body.message
            }
        },
        TableName: process.env.CONTACT_TABLE_NAME
    };

    dynamodb.putItem(params, function(err, data){
        if(err) {
            response.body = JSON.stringify(err);
            console.log(err);
            callback(null, response);
        } else {
            if(process.env.CONTACT_TOPIC_NAME) {
                var msg = "";
                msg = "Name: " + body.fullname + "\n";
                msg = msg + "Email: " + body.email + "\n";
                msg = msg + "Message: " + "\n" + body.message + "\n";

                var params = {
                    TopicArn: process.env.CONTACT_TOPIC_NAME,
                    Subject: `New Contact from Portfolio: ${body.subject}`,
                    Message: msg
                };

                sns.publish(params, context.done);
            }

            callback(null, response);
        }
    });
};
