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
    -   [uploadFile][9]
        -   [Parameters][10]
    -   [getDeployments][11]
        -   [Parameters][12]
    -   [getDeployment][13]
        -   [Parameters][14]
    -   [getDeploymentFiles][15]
        -   [Parameters][16]
    -   [getDeploymentFile][17]
        -   [Parameters][18]
    -   [deleteDeployment][19]
        -   [Parameters][20]
    -   [getLogs][21]
        -   [Parameters][22]
    -   [getAliases][23]
        -   [Parameters][24]
    -   [getDeploymentAliases][25]
        -   [Parameters][26]
    -   [getSecrets][27]
    -   [getTeams][28]
    -   [getProjects][29]
        -   [Parameters][30]
    -   [getDomains][31]
        -   [Parameters][32]
    -   [getCertificates][33]
        -   [Parameters][34]
    -   [getWebhooks][35]

## ZeitApiClient

### Parameters

-   `options` **[Object][36]** 
    -   `options.token` **[Object][36]** Api token

### Examples

```javascript
const ZeitApiClient = require("zeit-api-client")
const ZEIT_TOKEN = "your_zeit_now_token" // process.env.ZEIT_TOKEN
const zeitApi = new ZeitApiClient({token:ZEIT_TOKEN})
```

### getUser

Get the authenticated user

Official Documentation:
[https://zeit.co/docs/api#endpoints/user][37]

#### Examples

```javascript
const user = zeitApi.getUser()
```

### createDeployment

Create a new deployment with all the required and intended data.

Official Documentation:
[https://zeit.co/docs/api#endpoints/deployments/list-deployments][38]

#### Parameters

-   `data` **[Object][36]** 
    -   `data.name` **[String][39]** A string with the project name used in the deployment URL. The name string has a max length of 52 characters.
    -   `data.files` **[Array][40]** A list of objects with the files to be deployed.
    -   `data.version` **[Number][41]** The version of Now Platform to use. Must have the value of 2.
    -   `data.meta` **[Object][36]** An object containing the deployment's metadata. Multiple key-value pairs can be attached to a deployment. For example, { "foo": "bar" }.
    -   `data.env` **[Object][36]** An object containing the deployment's environment variable names and values. Secrets can be referenced by prefixing the value with @.
    -   `data.builds` **[Array][40]** A list of Build objects used to build sources in a deployment. For example, {[{ "src": "*.php", "use": "@now/php" }]}.
    -   `data.routes` **[Array][40]** A list of routes objects used to rewrite paths to point towards other internal or external paths. For example; [{ "src": "/docs", "dest": "https://docs.zeit.co" }].
    -   `data.regions` **[Array][40]** An array of the regions the deployment should be deployed to. For example, ["sfo", "bru"].
    -   `data.public` **[Boolean][42]** Whether a deployment's source and logs are available publicly.
    -   `data.target` **[String][39]** Either not defined, staging or production. If staging, a staging alias in the format <project>.<team>.now.sh will be assigned. If production, any aliases defined in alias will be assigned.
    -   `data.alias` **[Array][40]** Aliases that will get assigned when the deployment is READY and the target is production. The client needs to make a GET request to this API to ensure the assignment.


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

### uploadFile

Uploads a file and returns its size and sha if successful (currently only works in node). Returned object can be used with `createDeployment()` files section

Official Documentation:
[https://zeit.co/docs/api#endpoints/deployments/upload-deployment-files][43]

#### Parameters

-   `options` **[Object][36]** 
    -   `options.filePath` **[String][39]** Path pf file to upload

Returns **[Object][36]** fileData

Returns **[String][39]** fileData.sha sha1 hash of uploaded file

Returns **[String][39]** fileData.size size in bytes of uploaded file

### getDeployments

Fetch all deployments

Official Documentation:
[https://zeit.co/docs/api#endpoints/deployments/list-deployments][38]

#### Parameters

-   `options` **[Object][36]** 
    -   `options.limit` **[Number][41]** Maximum number of deployments to list from a request. (default: 5, max: 100)
    -   `options.from` **Timestamp** Get the deployment created after this Date timestamp. (default: current time)
    -   `options.projectId` **[String][39]** Filter deployments from the given `projectId`
    -   `options.meta-null` **[String][39]** [KEY] Filter deployments by the given meta key value pairs. e.g., `meta-githubDeployment=1`

### getDeployment

Fetch single deployment by id

Official Documentation:
[https://zeit.co/docs/api#endpoints/deployments/get-a-single-deployment][44]

#### Parameters

-   `deploymentId` **[String][39]** deployment id

### getDeploymentFiles

Fetch a list of deployments files

Official Documentation:
[https://zeit.co/docs/api#endpoints/deployments/list-deployment-files][45]

#### Parameters

-   `deploymentId` **[String][39]** deployment id

### getDeploymentFile

Fetch a single file by deployment and file id

Official Documentation:
[https://zeit.co/docs/api#endpoints/deployments/list-deployment-files][45]

#### Parameters

-   `deploymentId` **[String][39]** deployment id
-   `fileId`  

### deleteDeployment

Delete a single deployment by id

Official Documentation:
[https://zeit.co/docs/api#endpoints/deployments/delete-a-deployment][46]

#### Parameters

-   `deploymentId` **[String][39]** deployment id

### getLogs

Get the logs of a deployment by its ID.

Official Documentation:
[https://zeit.co/docs/api#endpoints/logs][47]

#### Parameters

-   `deploymentId` **[String][39]** deployment id

### getAliases

Fetch all aliases

Official Documentation:
[https://zeit.co/docs/api#endpoints/aliases/list-all-the-aliases][48]

#### Parameters

-   `options` **[Object][36]** 
    -   `options.limit` **[Number][41]** Maximum number of aliases to list from a request. (default: 5, max: 100)
    -   `options.from` **Timestamp** Get the aliases created after this Date timestamp. (default: current time)
    -   `options.projectId` **[String][39]** Filter aliases from the given `projectId`

### getDeploymentAliases

Fetch a deployment's aliases

Official Documentation:
[https://zeit.co/docs/api#endpoints/aliases/list-aliases-by-deployment][49]

#### Parameters

-   `deploymentId` **[String][39]** Id of deployment to fetch aliases from

### getSecrets

Fetch all secrets

Official Documentation:
[https://zeit.co/docs/api#endpoints/secrets/list-all-the-secrets][50]

### getTeams

Fetch all teams

Official Documentation:
[https://zeit.co/docs/api#endpoints/teams/list-all-your-teams][51]

### getProjects

Fetch all projects

Official Documentation:
[https://zeit.co/docs/api#endpoints/projects/get-all-projects][52]

#### Parameters

-   `options` **[Object][36]** 
    -   `options.limit` **[Number][41]** Limit the number of projects returned
    -   `options.from` **Timestamp** The updatedAt point where the list should start.
    -   `options.search` **[String][39]** Search projects by the name field.

### getDomains

Fetch all domains

Official Documentation:
[https://zeit.co/docs/api#endpoints/domains/list-all-the-domains][53]

#### Parameters

-   `options`  

### getCertificates

Fetch all certificates

Official Documentation:
[https://zeit.co/docs/api#endpoints/certificates/list-all-the-certificates][54]

#### Parameters

-   `options`  

### getWebhooks

Fetch all webhooks

Official Documentation:
[https://zeit.co/docs/api#endpoints/webhooks/list-all-webhooks][55]

[1]: #zeitapiclient

[2]: #parameters

[3]: #examples

[4]: #getuser

[5]: #examples-1

[6]: #createdeployment

[7]: #parameters-1

[8]: #examples-2

[9]: #uploadfile

[10]: #parameters-2

[11]: #getdeployments

[12]: #parameters-3

[13]: #getdeployment

[14]: #parameters-4

[15]: #getdeploymentfiles

[16]: #parameters-5

[17]: #getdeploymentfile

[18]: #parameters-6

[19]: #deletedeployment

[20]: #parameters-7

[21]: #getlogs

[22]: #parameters-8

[23]: #getaliases

[24]: #parameters-9

[25]: #getdeploymentaliases

[26]: #parameters-10

[27]: #getsecrets

[28]: #getteams

[29]: #getprojects

[30]: #parameters-11

[31]: #getdomains

[32]: #parameters-12

[33]: #getcertificates

[34]: #parameters-13

[35]: #getwebhooks

[36]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object

[37]: https://zeit.co/docs/api#endpoints/user

[38]: https://zeit.co/docs/api#endpoints/deployments/list-deployments

[39]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String

[40]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array

[41]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number

[42]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean

[43]: https://zeit.co/docs/api#endpoints/deployments/upload-deployment-files

[44]: https://zeit.co/docs/api#endpoints/deployments/get-a-single-deployment

[45]: https://zeit.co/docs/api#endpoints/deployments/list-deployment-files

[46]: https://zeit.co/docs/api#endpoints/deployments/delete-a-deployment

[47]: https://zeit.co/docs/api#endpoints/logs

[48]: https://zeit.co/docs/api#endpoints/aliases/list-all-the-aliases

[49]: https://zeit.co/docs/api#endpoints/aliases/list-aliases-by-deployment

[50]: https://zeit.co/docs/api#endpoints/secrets/list-all-the-secrets

[51]: https://zeit.co/docs/api#endpoints/teams/list-all-your-teams

[52]: https://zeit.co/docs/api#endpoints/projects/get-all-projects

[53]: https://zeit.co/docs/api#endpoints/domains/list-all-the-domains

[54]: https://zeit.co/docs/api#endpoints/certificates/list-all-the-certificates

[55]: https://zeit.co/docs/api#endpoints/webhooks/list-all-webhooks



## License

MIT © [Luka Kakia](https://github.com/manguluka)
