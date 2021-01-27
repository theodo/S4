export const requestUploadToken = {
  handler: "examples/allowMe/functions/requestUploadToken/handler.main",
  environment: {
    TOKEN_TABLE_NAME: "${self:custom.tokenTableName}",
  },
  events: [
    {
      httpApi: {
        method: "GET",
        path: "/api/upload-token",
      },
    },
  ],
};
