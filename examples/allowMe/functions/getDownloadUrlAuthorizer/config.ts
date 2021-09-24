export const getDownloadUrlAuthorizer = {
  handler: "examples/allowMe/functions/getDownloadUrlAuthorizer/handler.main",
  environment: {
    GET_DOWNLOAD_URL_LAMBDA_ARN: "${self:custom.getSignedDownloadUrlArn}",
  },
};
