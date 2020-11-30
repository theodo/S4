import * as AwsConfig from "serverless/aws";

export enum KeyType {
  HASH = "HASH",
  RANGE = "RANGE",
}
const { HASH, RANGE } = KeyType;

export const PRIMARY_KEY = "pk";
export const SORT_KEY = "sk";
export const LSI_KEYS = { LSI: "lsi" };

export const LSI = {
  BY_LSI: {
    IndexName: "byLsi",
    KeySchema: [
      { AttributeName: PRIMARY_KEY, KeyType: HASH },
      { AttributeName: LSI_KEYS.LSI, KeyType: RANGE },
    ],
    Projection: { ProjectionType: "ALL" },
  },
};

export const TokenTable: AwsConfig.CloudFormationResource = {
  Type: "AWS::DynamoDB::Table",
  Properties: {
    AttributeDefinitions: [
      { AttributeName: PRIMARY_KEY, AttributeType: "S" },
      { AttributeName: SORT_KEY, AttributeType: "S" },
      { AttributeName: LSI_KEYS.LSI, AttributeType: "S" },
    ],
    KeySchema: [
      { AttributeName: PRIMARY_KEY, KeyType: HASH },
      { AttributeName: SORT_KEY, KeyType: RANGE },
    ],
    BillingMode: "PAY_PER_REQUEST",
    LocalSecondaryIndexes: [LSI.BY_LSI],
    TimeToLiveSpecification: {
      AttributeName: "_ttl",
      Enabled: true,
    },
    StreamSpecification: {
      StreamViewType: "NEW_AND_OLD_IMAGES",
    },
  },
};
