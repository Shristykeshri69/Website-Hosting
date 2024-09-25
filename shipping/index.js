const AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1'
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const dynamoDBTable = 'sh_27462_table';

exports.handler = async (event) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    
    for (const record of event.Records) {
        let data;
        
        try {
            data = JSON.parse(Buffer.from(record.kinesis.data, 'base64').toString('utf-8'));
        } catch (error) {
            console.error('Error parsing Kinesis record:', error);
            continue;
        }
        
        console.log('Parsed data:', data);
        
        if (!data.product_id || typeof data.qty !== 'number') {
            console.error('Invalid data:', data);
            continue;
        }
        
        let productId = data.product_id;
        let updatedQty = data.qty - 1;
        
        console.log(`Product ID: ${productId}, Updated Quantity: ${updatedQty}`);
        
        if (updatedQty < 0) {
            console.error('Quantity cannot be negative:', updatedQty);
            continue;
        }
        
        const params = {
            TableName: dynamoDBTable,
            Key: {
                "product_id": productId
            },
            UpdateExpression: 'set qty = :value',
            ExpressionAttributeValues: {
                ":value": updatedQty
            },
            ReturnValues: 'UPDATED_NEW'
        };
        
        try {
            const response = await dynamoDB.update(params).promise();
            console.log('Update success:', JSON.stringify(response, null, 2));
        } catch (error) {
            console.error('Update failed:', error);
        }
    }
    
    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Processing completed' })
    };
};
