# S4: Serverless Simple Storage Service

**S4** is a serverless stack designed to deploy minimal [AWS](https://aws.amazon.com) resources to safely handle file upload and download for any application with different Access Control Lists for upload and download.

The three core functionalities of S4 are:

- **Generate S3 presigned upload URL:** Generate S3 presigned POST upload url for any user possessing a token that was previoulsy put in S4 token table.
- **Dispatch file uploaded event:** Dispatch an event alerting that a file was uploaded. The event may then be used to trigger a lambda in your project for instance.
- **Generate S3 signed download URL:** Generate a signed download url so that an authenticated user downloads the file directly from S3.

## Features

- **Deployment ready:** set up your AWS profile and serverless deploy
- **Security:** S3 pre-signed Urls, Lambdas to handle ACLs, the file type is verified directly after upload;
- **Cost efficiency:** Lambdas never process any file content, files are uploaded directly to S3;

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

## Tutorial: simple example to use S4

Let's use S4 to implement a file upload/download service with a trivial authorization mechanism. Every user that has the string "allowMeToUpload" in their name can upload. With "allowMeToDownload" they can download any previously uploaded file. It is the "allowMe" example in S4 repository.

### Quickly set up S4 and test "allowMe" example

The allow me examples in the [examples](examples)

### The getUploadUrlAuthorizer Lambda

This Api Gateway Lambda custom authorizer checks that the user is allowed to upload a file and invoke another Lambda to generate a signed upload URL.
**What is necessary to implement?** The access control strategy in the `getUploadUrlAuthorizer` code. Currently it uses the queryStringParameters of the request but it could be any [Api Gateway Lambda custom authorizer](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-use-lambda-authorizer.html).
**What does it do in the example?** The lambda is triggered by an API Gateway Get event with a query string parameter name that should containe "allowMeToUpload" to request and return the download url.

[See getUploadUrlAuthorizer code](examples/allowMe/functions/getUploadUrlAuthorizer/handler.ts)

### The onFileUploaded Lambda

This Lambda is triggered by the `FILE_UPLOADED` EventBridge event and receives the file metadata as payload of the event.
**What is necessary to implement?** You will want to store, in any database, any data needed to retrieve informations about the uploaded file later.
**What does it do in the example?** It stores all the uploaded file metadata into the table shipped with S4.

[See onFileUploaded code](examples/allowMe/functions/onFileUploaded/handler.ts)

### The getDownloadUrlAuthorizer Lambda

This Api Gateway Lambda custom authorizer checks that the user is allowed to download the file, requested by its file prefix, and invoke another Lambda to generate a signed download URL.
**What is necessary to implement?** The access control strategy in the `getDownloadUrlAuthorizer` code. Currently it uses the queryStringParameters of the request but it could be any [Api Gateway Lambda custom authorizer](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-use-lambda-authorizer.html).
**What does it do in the example?** The lambda is triggered by an API Gateway Get event with a query string parameter name that should containe "allowMeToDownload" to request and return the download url.

[See getDownloadUrlAuthorizer code](examples/allowMe/functions/getDownloadUrlAuthorizer/handler.ts)

### Test your service

Let's deploy S4, upload and download a pdf

1. Deploy your stack

   ```bash
   yarn sls deploy
   ```

2. Request an upload url
   **Request:**

   ```bash
   curl 'https://{API_GATEWAY_ID}.execute-api.{REGION}.amazonaws.com/{STAGE}/api/signed-upload-url?name=allowMeToUpload&fileType=application/pdf'
   ```

   **Response:**

   ```json
   {
     "url": { PRESIGNED_UPLOAD_URL },
     "fields": {
       "x-amz-storage-class": { X_AMZ_STORAGE_CLASS },
       "bucket": { BUCKET_NAME },
       "X-Amz-Algorithm": { X_AMZ_ALGORITHM },
       "X-Amz-Credential": { X_AMZ_CREDENTIAL },
       "X-Amz-Date": { X_AMZ_DATE },
       "X-Amz-Security-Token": { X_AMZ_SECURITY_TOKEN },
       "Policy": { POLICY },
       "X-Amz-Signature": { X_AMZ_SIGNATURE }
     },
     "filePrefix": { FILE_PREFIX }
   }
   ```

3. Upload the file

```bash
   curl --request POST { PRESIGNED_UPLOAD_URL }\
   --form 'key="{ FILE_PREFIX }/${filename}"' \
   --form 'bucket={ BUCKET_NAME }' \
   --form 'x-amz-storage-class={ X_AMZ_STORAGE_CLASS }' \
   --form 'Content-Type="application/pdf"' \
   --form 'X-Amz-Algorithm={ X_AMZ_ALGORITHM }' \
   --form 'X-Amz-Credential={ X_AMZ_CREDENTIAL }' \
   --form 'X-Amz-Date={ X_AMZ_DATE }' \
   --form 'X-Amz-Security-Token={ X_AMZ_SECURITY_TOKEN }' \
   --form 'Policy={ POLICY }' \
   --form 'X-Amz-Signature={ X_AMZ_SIGNATURE }' \
   --form 'file=@{ PATH_TO_FILE }'
```

4. Request a download URL

   **Request:**

   ```bash
   curl "https://{API_GATEWAY_ID}.execute-api.{REGION}.amazonaws.com/{STAGE}/api/download-url?filePrefix={FILE_PREFIX}&filename={FILENAME}&name=allowMeToDownload"
   ```

   **Response:**

   ```json
   { "downloadUrl": { DOWNLOAD_URL } }
   ```

5. Download the file

```bash
   curl { DOWNLOAD_URL } --output downloaded_file.pdf
```

### Bonus: the listFiles Lambda

This Lambda queries uploaded files metadata to display a list of files available to download in the following React component example :

[See listFiles code](examples/allowMe/functions/listFiles/handler.ts)

## Architecture

### Resources

- **A S3 bucket:** a S3 bucket to _store the files_ of end users.
- **A Files metadata table:** a Dynamodb table to store _uploaded files metadat_. These metadata is used to to retrieve the files after their upload
- **A getSignedUploadUrl http endpoint:** an endpoint on the route `/api/get-signed-upload-url?fileType=FILTE_TYPE&name=NAME` that verifies that the user is allowed to upload files,using the name query string parameter, and returns a presigned POST url to upload a file directly to the S3 bucket.

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

- **A getSignedDownloadUrl http endpoint:** an endpoint on the route `/api/get-signed-download-url?filePrefix=FILTE_PREFIX&fileName=FILE_NAME&name=NAME` that verifies that the user is allowed to download files, using the name query string parameter, and returns a presigned POST url to download a file directly to the S3 bucket.

### Flowchart

The three Lambda functions with a person icon should be implemented by S4 user.

![Image](./docs/S4-chart.png)
