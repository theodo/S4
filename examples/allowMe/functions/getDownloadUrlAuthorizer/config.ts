export const getDownloadUrlAuthorizer = {
  handler: "examples/allowMe/functions/getDownloadUrlAuthorizer/handler.main",
  environment: {
    TOKEN_TABLE_NAME: "${self:custom.tokenTableName}",
    GET_DOWNLOAD_URL_LAMBDA_ARN: "${self:custom.getSignedDownloadUrlArn}",
  },
};
