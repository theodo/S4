export default {
  type: "object",
  properties: {
    queryStringParameters: {
      type: "object",
      properties: {
        uploadToken: { type: "string" },
        filetype: { type: "string" },
      },
      required: ["uploadToken", "filetype"],
    },
  },
  required: ["queryStringParameters"],
} as const;
