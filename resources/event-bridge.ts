import * as AwsConfig from "serverless/aws";

export const EventBridge: AwsConfig.CloudFormationResource = {
  Type: "AWS::Events::EventBus",
  Properties: { Name: "s4" },
};
