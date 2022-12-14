const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const db = new DynamoDBClient({});
const {DeleteItemCommand} = require("@aws-sdk/client-dynamodb");
const { marshall } = require("@aws-sdk/util-dynamodb");


const deleteComment = async (event) => {
    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
      },
    };
  
    try {
      const params = {
        TableName: process.env.DYNAMODB_COMMENT_TABLE,
        Key: marshall({
          postId: event.pathParameters.postId,
          commentId: event.pathParameters.commentId,
        }),
        ConditionExpression: 'attribute_exists(postId)',
      };
      const deleteResult = await db.send(new DeleteItemCommand(params));
    //   if (deleteResult.ConsumedCapacity) {
    //     response.body = JSON.stringify({
    //       status: "fail",
    //       message: "Comment does not exist !",
    //     });
    //   } else {
        response.body = JSON.stringify({
          message: "Successfully deleted post.",
          deleteResult,
        });
      
    } catch (e) {
      console.error(e);
      response.statusCode = 500;
      response.body = JSON.stringify({
        message: "Failed to delete comment.",
        errorMsg: e.message,
        errorStack: e.stack,
      });
    }
  
    return response;
  };

module.exports = { deleteComment};