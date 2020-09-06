import * as AwsConfig from "serverless/aws";

export const Bucket: AwsConfig.CloudFormationResource = {
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
