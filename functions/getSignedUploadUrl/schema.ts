export default {
  type: "object",
  properties: {
    queryStringParameters: {
      type: "object",
      properties: {
        fileType: { type: "string" },
        name: { type: "string" },
      },
      required: ["fileType", "name"],
    },
  },
  required: ["queryStringParameters"],
} as const;
