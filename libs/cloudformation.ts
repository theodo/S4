export const ref = <R extends Record<string, unknown>>(
  resource: R
): Record<"Ref", keyof R> => {
  if (Object.keys(resource).length !== 1) {
    throw new Error("Ref can only be used on one resource");
  }
  const [resourceName] = Object.keys(resource) as (keyof R)[];
  return { Ref: resourceName };
};
