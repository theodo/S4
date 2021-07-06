export const getUploadUrlAuthorizer = {
  handler: "examples/allowMe/functions/getUploadUrlAuthorizer/handler.main",
  environment: {
    GET_UPLOAD_URL_LAMBDA_ARN: "${self:custom.getSignedUploadUrlArn}",
  },
};
