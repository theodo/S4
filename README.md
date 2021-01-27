# S4: Serverless Simple Storage Service

**S4** is a serverless stack designed to deploy minimal [AWS](https://aws.amazon.com) resources to safely handle file upload and download for any application.

The three core functionalities of S4 are:

- **Generate S3 presigned upload URL:** Generate S3 presigned POST upload url for any user possessing a token that was previoulsy put in S4 token table.
- **Dispatch file uploaded event:** Dispatch an event alerting that a file was uploaded. The event may then be used to trigger a lambda in your project for instance.
- **Generate S3 signed download URL:** Generate a signed download url so that an authenticated user downloads the file directly from S3.

## Features

- **Security:**

  - ensure user is authorized to upload or download
  - file type checking

- **Low price:**
  - serverless
  - event based
  - limit file size

## Installation and basic usage

### Deploy

```bash
yarn sls deploy
```

### Create template and deploy

```bash
serverless create --template-url https://github.com/theodo/S4 --path myService
cd myService && serverless deploy
```

## Sample codebase: an upload list with react and ant design

TODO

## Architecture

### Resources

- **A S3 bucket:** a S3 bucket to _store the files_ of end users.
- **A token table:** a Dynamodb table to store _file upload tokens_. These tokens are use to verify that the end user is allowed to upload a file.
- **A getSignedUploadUrl http endpoint:** an endpoint on the route `/api/get-signed-upload-url?uploadToken=UPLOAD_TOKEN&fileType=FILTE_TYPE` that verifies that the upload token is in the token table and returns a presigned POST url to upload a file directly to the S3 bucket.

- **A dispatchFileUploadedEvent handler and an event bridge:** a handler that dispatches a `FILE_UPLOADED` event in an event bridge. This event may be used to trigger any lambda. The payload of the event contains:

```ts
{
    uploadToken: string,
    ressourceId: string,
    ressourceName: string,
    email: string,
    bucketName: string,
    fileName: string,
    fileSize: number,
}
```

- **A getSignedDownloadUrl handler:** this handler may be invoked by an http endpoint of your project to generate a downloadUrl provided the fileName and uploadToken used to upload the file.

```ts
async (filePrefix: string, fileName: string): Promise<{ downloadUrl: string }>
```

### Flowchart

![Image](./docs/S4-chart.png)

## Contribute

TODO

## References

TODO
