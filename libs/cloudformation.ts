import { AWS } from "@serverless/typescript";
import { findKey } from "lodash";

interface CloudFormationReference {
  Ref: string;
}

export const ref = (
  resources: AWS["resources"]["Resources"],
  referencedResource: AWS["resources"]["Resources"]["value"]
): CloudFormationReference => {
  return {
    Ref: findKey(resources, (resource) => referencedResource === resource),
  };
};
