export const listFiles = {
  handler: "examples/allowMe/functions/listFiles/handler.main",
  environment: {
    TOKEN_TABLE_NAME: "${self:custom.tokenTableName}",
  },
  events: [
    {
      httpApi: {
        method: "GET",
        path: "/api/files",
      },
    },
  ],
};
