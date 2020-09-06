enum Stages {
  dev = "dev",
  preprod = "preprod",
  prod = "prod",
}

export type StageDependantVariable<T> = {
  [key in keyof typeof Stages]: T;
};

export const DEFAULT_STAGE = Stages.dev;

export const AWS_ACCOUNT_ID: StageDependantVariable<number | false> = {
  dev: false,
  preprod: 1,
  prod: 1,
};

export const COGNITO_USER_POOL_NAME = {
  dev: "cognitoUserPoolName",
  preprod: "cognitoUserPoolName",
  prod: "cognitoUserPoolName",
};

export const COGNITO_DOMAIN: StageDependantVariable<string> = {
  dev: "cognitoDomain",
  preprod: "YOURAPP-preprod",
  prod: "YOURAPP",
};

export const HOSTS: StageDependantVariable<string> = {
  dev: "http://localhost:3000",
  preprod: "https://YOURAPP-staging",
  prod: "https://YOURAPP",
};

export const AZURE_APP_ID: StageDependantVariable<string> = {
  dev: "azureAppId",
  preprod: "azureAppId",
  prod: "azureAppId",
};

export const HTTP_API_ID: StageDependantVariable<string> = {
  dev: "httpApiId",
  preprod: "httpApiId",
  prod: "httpApiId",
};

export const ACM_ARN = {
  preprod: "acm-arn",
  prod: "acm-arn",
};

export const ACM_API_ARN = {
  preprod: "acm-api-arn",
  prod: "acm-api-arn",
};

export const SSL_SUPPORTED_METHOD = {
  preprod: "sni-only",
  prod: "sni-only",
};

export const ALIASES = {
  preprod: "YOURAPP-staging",
  prod: "YOURAPP",
};

export const API_ALIASES = {
  preprod: ["api." + ALIASES.preprod],
  prod: ["api." + ALIASES.prod],
};

export const CF_DEFAULT_CERTIFICATE = {
  dev: true,
};
