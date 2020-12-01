import { AWS } from "@serverless/typescript";

export const Bucket: AWS["resources"]["Resources"]["value"] = {
  Type: "AWS::S3::Bucket",
  DeletionPolicy: "Retain",
  Properties: {
    CorsConfiguration: {
      CorsRules: [
        {
          AllowedOrigins: ["http://localhost:3000"],
          AllowedHeaders: ["*"],
          AllowedMethods: ["POST"],
        },
      ],
    },
  },
};
