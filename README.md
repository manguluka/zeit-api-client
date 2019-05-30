# zeit-api-client

[![NPM](https://img.shields.io/npm/v/zeit-api-client.svg)](https://www.npmjs.com/package/zeit-api-client)

> API client for Zeit Now integrations based on @zeit/integration-utils

Originally created for participants in the inaugaural [Zeit Integrations Hackathon](https://zeit.co/hackathon). 

Currently supports a small subset of the Now API, contributions(tests/documentation/endpoint support) welcome and appreciated. Feel free to contact `Luka Kakia` on the hackathon Slack with any questions.

Support for usage outside of a Zeit integration "coming soon".

## Install

```bash
npm install --save zeit-api-client
# or 
yarn add zeit-api-client
```
## Usage
```javascript
const { withUiHook, htm } = require("@zeit/integration-utils");
const { ZeitIUApiClient } = require("zeit-api-client")
module.exports = withUiHook(async ({ payload, zeitClient }) => {
	const zeitApi = new ZeitIUApiClient(zeitClient)
	const latestDeployments = await zeitApi.getDeployments()
	return htm`
		<Page>
			<H1>Latest Deployments</H1>
			<Code>
				${JSON.stringify(latestDeployments, null, 2)}
			</Code>
		</Page>
	`;
});

```
## Documentation
[View Documentation](https://zeit-api-client-docs.lilo.now.sh/)


-   [ZeitIUApiClient][1]
    -   [Parameters][2]
    -   [Examples][3]
    -   [getDeployments][4]
        -   [Parameters][5]
        -   [Examples][6]
    -   [getDeployment][7]
        -   [Parameters][8]
        -   [Examples][9]
    -   [getDeploymentFiles][10]
        -   [Parameters][11]
        -   [Examples][12]
    -   [getDeploymentFile][13]
        -   [Parameters][14]
        -   [Examples][15]
    -   [createDeployment][16]
        -   [Parameters][17]
        -   [Examples][18]

## ZeitIUApiClient

### Parameters

-   `zeitClient` **[Object][19]** zeitClient from UIHook

### Examples

```javascript
const {ZeitIUApiClient} = require("zeit-api-client")
const zeitApi = new ZeitUiApiClient(zeitClient)
```

### getDeployments

Fetch all deployments

Official Documentation:
[https://zeit.co/docs/api#endpoints/deployments/list-deployments][20]

#### Parameters

-   `options` **[Object][19]**  (optional, default `{}`)
    -   `options.query` **[Object][19]** optional query params (optional, default `{}`)

#### Examples

```javascript
const {ZeitIUApiClient} = require("zeit-api-client")
const zeitApi = new ZeitUiApiClient(zeitClient)
const deployments = zeitApi.getDeployments()
```

### getDeployment

Fetch single deployment by id

Official Documentation:
[https://zeit.co/docs/api#endpoints/deployments/get-a-single-deployment][21]

#### Parameters

-   `id` **[String][22]** deployment id
-   `options` **[Object][19]**  (optional, default `{}`)
    -   `options.query` **[Object][19]** optional query params (optional, default `{}`)

#### Examples

```javascript
const {ZeitIUApiClient} = require("zeit-api-client")
const zeitApi = new ZeitIUApiClient(zeitClient)
const deploymentId = "dpl_***"
const deployment = zeitApi.getDeployment(deploymentId)
```

### getDeploymentFiles

Fetch a list of all files in deployment

Official Documentation:
[https://zeit.co/docs/api#endpoints/deployments/list-deployment-files][23]

#### Parameters

-   `id` **[String][22]** deployment id
-   `options` **[Object][19]**  (optional, default `{}`)
    -   `options.query` **[Object][19]** optional query params (optional, default `{}`)

#### Examples

```javascript
const {ZeitIUApiClient} = require("zeit-api-client")
const zeitApi = new ZeitIUApiClient(zeitClient)
const deploymentId = "dpl_***"
const deployment = zeitApi.getDeploymentFiles(deploymentId)
```

### getDeploymentFile

Fetch a single file from a deployment

Official Documentation:
[https://zeit.co/docs/api#endpoints/deployments/get-single-file-contents][24]

#### Parameters

-   `deploymentId` **[String][22]** deployment id
-   `fileId`  
-   `options` **[Object][19]**  (optional, default `{}`)
    -   `options.query` **[Object][19]** optional query params (optional, default `{}`)
-   `fileID` **[String][22]** file id

#### Examples

```javascript
const {ZeitIUApiClient} = require("zeit-api-client")
const zeitApi = new ZeitIUApiClient(zeitClient)
const deploymentId = "dpl_***"
const deployment = zeitApi.getDeploymentFiles(deploymentId)
```

### createDeployment

Create a new deployment

Official Documentation:
[https://zeit.co/docs/api#endpoints/deployments/create-a-new-deployment][25]

#### Parameters

-   `data` **[Object][19]** POST body data

#### Examples

```javascript
const {ZeitIUApiClient} = require("zeit-api-client")
const zeitApi = new ZeitIUApiClient(zeitClient)
const deloymentData = {
  "name": "my-deployment",
  "version": 2,
  "files": [
    {
      "file": "index.html",
      "data": "<!doctype html>\n<html>\n  <head>\n    <title>A simple deployment with the Now API!</title>\n  </head>\n  <body>\n    <h1>Welcome to a simple static file</h1>\n    <p>Deployed with <a href=\"https://zeit.co/docs/api\">ZEIT&apos;s Now API</a>!</p>\n    </body>\n</html>"
    }
  ]
}
const deployment = zeitApi.createDeployment(data)
```

[1]: #zeitiuapiclient

[2]: #parameters

[3]: #examples

[4]: #getdeployments

[5]: #parameters-1

[6]: #examples-1

[7]: #getdeployment

[8]: #parameters-2

[9]: #examples-2

[10]: #getdeploymentfiles

[11]: #parameters-3

[12]: #examples-3

[13]: #getdeploymentfile

[14]: #parameters-4

[15]: #examples-4

[16]: #createdeployment

[17]: #parameters-5

[18]: #examples-5

[19]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object

[20]: https://zeit.co/docs/api#endpoints/deployments/list-deployments

[21]: https://zeit.co/docs/api#endpoints/deployments/get-a-single-deployment

[22]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String

[23]: https://zeit.co/docs/api#endpoints/deployments/list-deployment-files

[24]: https://zeit.co/docs/api#endpoints/deployments/get-single-file-contents

[25]: https://zeit.co/docs/api#endpoints/deployments/create-a-new-deployment


## License

MIT © [Luka Kakia](https://github.com/manguluka)
