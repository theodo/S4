export default {
  type: "object",
  properties: {
    queryStringParameters: {
      type: "object",
      properties: {
        uploadToken: { type: "string" },
        fileType: { type: "string" },
      },
      required: ["uploadToken", "fileType"],
    },
  },
  required: ["queryStringParameters"],
} as const;
