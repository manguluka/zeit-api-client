# zeit-api-client

[![NPM](https://img.shields.io/npm/v/zeit-api-client.svg)](https://www.npmjs.com/package/zeit-api-client)

> API client for ZEIT Now and ZEIT Integrations


**Related Links**
- [https://github.com/manguluka/zeit-integration-starter-offline](https://github.com/manguluka/zeit-integration-starter-offline) Offline-first project starter and component showcase for Zeit Integrations
- [https://github.com/manguluka/zeit-integration-toolbox](https://github.com/manguluka/zeit-integration-toolbox) Tools to facilitate rapid development of Zeit Integrations
- [https://github.com/zeit/awesome-zeit-integrations](https://github.com/zeit/awesome-zeit-integrations) This list aggregates the best resources for ZEIT Integrations.

## Install

```bash
npm install --save zeit-api-client
# or 
yarn add zeit-api-client
```
## Usage
### Basic
```javascript
const ZeitApiClient = require("zeit-api-client")
// import ZeitApiClient from "zeit-api-client"

const zeitApi = new ZeitApiClient({token:process.env.ZEIT_TOKEN})
const latestDeployments = await zeitApi.getDeployments({limit:5})
console.log(latestDeployments[0])
```

### Within an integration 
```javascript
const { withUiHook, htm } = require("@zeit/integration-utils");
const ZeitApiClient  = require("zeit-api-client")
module.exports = withUiHook(async ({ payload, zeitClient }) => {
  const zeitApi = new ZeitApiClient({token:payload.token})
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



## Endpoints implemented
### USer
- [x] getUser()

### Deployments
- [x] createDeployment()
- [x] getDeployments()
- [x] getDeployment(deploymentId)
- [x] getDeploymentFiles(deploymentId)
- [x] getDeploymentFile(deploymentId,fileId)
- [ ] createDeploymentFile(deploymentId)

### Logs
- [x] getLogs()

### Integration Metadat
### Domains
### DNS
### Certificates
### Aliases
### Secrets
### Teams
### Projects
### Authentication
### OAuth2
### Webhooks


## Documentation
[View Documentation](https://zeit-api-client-docs.lilo.now.sh/)


-   [ZeitApiClient][1]
    -   [Parameters][2]
    -   [Examples][3]
    -   [getUser][4]
        -   [Examples][5]
    -   [createDeployment][6]
        -   [Parameters][7]
        -   [Examples][8]
    -   [getDeployments][9]
        -   [Parameters][10]
    -   [getDeployment][11]
        -   [Parameters][12]
    -   [getDeploymentFiles][13]
        -   [Parameters][14]
    -   [getDeploymentFile][15]
        -   [Parameters][16]
    -   [deleteDeployment][17]
        -   [Parameters][18]
    -   [getLogs][19]
        -   [Parameters][20]

## ZeitApiClient

### Parameters

-   `options` **[Object][21]** 
    -   `options.token` **[Object][21]** Api token

### Examples

```javascript
const ZeitApiClient = require("zeit-api-client")
const ZEIT_TOKEN = "your_zeit_now_token" // process.env.ZEIT_TOKEN
const zeitApi = new ZeitApiClient({token:ZEIT_TOKEN})
```

### getUser

Get the authenticated user

Official Documentation:
[https://zeit.co/docs/api#endpoints/user][22]

#### Examples

```javascript
const user = zeitApi.getUser()
```

### createDeployment

Create a new deployment with all the required and intended data.

Official Documentation:
[https://zeit.co/docs/api#endpoints/deployments/list-deployments][23]

#### Parameters

-   `data` **[Object][21]** 
    -   `data.name` **[String][24]** A string with the project name used in the deployment URL. The name string has a max length of 52 characters.
    -   `data.files` **[Array][25]** A list of objects with the files to be deployed.
    -   `data.version` **[Number][26]** The version of Now Platform to use. Must have the value of 2.
    -   `data.meta` **[Object][21]** An object containing the deployment's metadata. Multiple key-value pairs can be attached to a deployment. For example, { "foo": "bar" }.
    -   `data.env` **[Object][21]** An object containing the deployment's environment variable names and values. Secrets can be referenced by prefixing the value with @.
    -   `data.builds` **[Array][25]** A list of Build objects used to build sources in a deployment. For example, {[{ "src": "*.php", "use": "@now/php" }]}.
    -   `data.routes` **[Array][25]** A list of routes objects used to rewrite paths to point towards other internal or external paths. For example; [{ "src": "/docs", "dest": "https://docs.zeit.co" }].
    -   `data.regions` **[Array][25]** An array of the regions the deployment should be deployed to. For example, ["sfo", "bru"].
    -   `data.public` **[Boolean][27]** Whether a deployment's source and logs are available publicly.
    -   `data.target` **[String][24]** Either not defined, staging or production. If staging, a staging alias in the format <project>.<team>.now.sh will be assigned. If production, any aliases defined in alias will be assigned.
    -   `data.alias` **[Array][25]** Aliases that will get assigned when the deployment is READY and the target is production. The client needs to make a GET request to this API to ensure the assignment.


#### Examples

```javascript
const deploymentData = {
  "name": "my-instant-deployment",
  "version": 2,
  "files": [
    {
      "file": "index.html",
      "data": "<!doctype html>\n<html>\n  <head>\n    <title>A simple deployment with the Now API!</title>\n  </head>\n  <body>\n    <h1>Welcome to a simple static file</h1>\n    <p>Deployed with <a href=\"https://zeit.co/docs/api\">ZEIT&apos;s Now API</a>!</p>\n    </body>\n</html>"
    }
  ]
}
const newDeployment = zeitApi.createDeployment(deploymentData)
```

### getDeployments

Fetch all deployments

Official Documentation:
[https://zeit.co/docs/api#endpoints/deployments/list-deployments][23]

#### Parameters

-   `options` **[Object][21]** 
    -   `options.limit` **[Number][26]** Maximum number of deployments to list from a request. (default: 5, max: 100)
    -   `options.from` **Timestamp** Get the deployment created after this Date timestamp. (default: current time)
    -   `options.projectId` **[String][24]** Filter deployments from the given `projectId`
    -   `options.meta-null` **[String][24]** [KEY] Filter deployments by the given meta key value pairs. e.g., `meta-githubDeployment=1`

### getDeployment

Fetch single deployment by id

Official Documentation:
[https://zeit.co/docs/api#endpoints/deployments/get-a-single-deployment][28]

#### Parameters

-   `deploymentId` **[String][24]** deployment id

### getDeploymentFiles

Fetch a list of deployments files

Official Documentation:
[https://zeit.co/docs/api#endpoints/deployments/list-deployment-files][29]

#### Parameters

-   `deploymentId` **[String][24]** deployment id

### getDeploymentFile

Fetch a single file by deployment and file id

Official Documentation:
[https://zeit.co/docs/api#endpoints/deployments/list-deployment-files][29]

#### Parameters

-   `deploymentId` **[String][24]** deployment id
-   `fileId`  

### deleteDeployment

Delete a single deployment by id

Official Documentation:
[https://zeit.co/docs/api#endpoints/deployments/delete-a-deployment][30]

#### Parameters

-   `deploymentId` **[String][24]** deployment id

### getLogs

Get the logs of a deployment by its ID.

Official Documentation:
[https://zeit.co/docs/api#endpoints/logs][31]

#### Parameters

-   `deploymentId` **[String][24]** deployment id

[1]: #zeitapiclient

[2]: #parameters

[3]: #examples

[4]: #getuser

[5]: #examples-1

[6]: #createdeployment

[7]: #parameters-1

[8]: #examples-2

[9]: #getdeployments

[10]: #parameters-2

[11]: #getdeployment

[12]: #parameters-3

[13]: #getdeploymentfiles

[14]: #parameters-4

[15]: #getdeploymentfile

[16]: #parameters-5

[17]: #deletedeployment

[18]: #parameters-6

[19]: #getlogs

[20]: #parameters-7

[21]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object

[22]: https://zeit.co/docs/api#endpoints/user

[23]: https://zeit.co/docs/api#endpoints/deployments/list-deployments

[24]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String

[25]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array

[26]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number

[27]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean

[28]: https://zeit.co/docs/api#endpoints/deployments/get-a-single-deployment

[29]: https://zeit.co/docs/api#endpoints/deployments/list-deployment-files

[30]: https://zeit.co/docs/api#endpoints/deployments/delete-a-deployment

[31]: https://zeit.co/docs/api#endpoints/logs


## License

MIT © [Luka Kakia](https://github.com/manguluka)
