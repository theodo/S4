import { Context, Handler } from "aws-lambda";
import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import jsonValidator from "@middy/validator";
import httpErrorHandler from "@middy/http-error-handler";

interface ApplyMiddlewaresOptions {
  inputSchema?: unknown;
}

export const applyMiddlewares = <T, R>(
  handler: Handler<T, R>,
  options: ApplyMiddlewaresOptions = {}
): middy.Middy<T, R, Context> => {
  const { inputSchema } = options;
  const middyfiedHandler = middy(handler);

  if (inputSchema) {
    middyfiedHandler.use(jsonBodyParser());

    middyfiedHandler.use(jsonValidator({ inputSchema }));
  }

  middyfiedHandler.use(httpErrorHandler());

  return middyfiedHandler;
};
