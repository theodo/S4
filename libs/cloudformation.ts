import {
  CloudFormationResource,
  CloudFormationResources,
} from 'serverless/aws';
import { findKey } from 'lodash';

interface CloudFormationReference {
  Ref: string;
}

export const ref = (
  resources: CloudFormationResources,
  referencedResource: CloudFormationResource,
): CloudFormationReference => {
  return {
    Ref: findKey(resources, (resource) => referencedResource === resource),
  };
};
