export const getDownloadUrl = {
  handler: "examples/allowMe/functions/getDownloadUrl/handler.main",
  environment: {
    TOKEN_TABLE_NAME: "${self:custom.tokenTableName}",
    GET_DOWNLOAD_URL_LAMBDA_ARN: "${self:custom.getSignedDownloadUrlArn}",
  },
  events: [
    {
      httpApi: {
        method: "GET",
        path: "/api/download-url",
      },
    },
  ],
};
