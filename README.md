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

## Endpoints implemented:
### User
- [x] getUser()

### Deployments
- [x] createDeployment()
- [x] getDeployments(options)
- [x] getDeployment(deploymentId)
- [x] getDeploymentFiles(deploymentId)
- [x] getDeploymentFile(deploymentId,fileId)
- [ ] createDeploymentFile(deploymentId)

### Logs
- [x] getLogs()

### Integration Metadata
### Domains
### DNS
### Certificates
### Aliases
- [x] getAliases(options)
- [x] getDeploymentAliases()

### Secrets
- [x] getSecrets()

### Teams
- [x] getTeams()

### Projects
- [x] getProjects(options)

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
    -   [getAliases][21]
        -   [Parameters][22]
    -   [getDeploymentAliases][23]
        -   [Parameters][24]
    -   [getSecrets][25]
    -   [getTeams][26]
    -   [getProjects][27]
        -   [Parameters][28]

## ZeitApiClient

### Parameters

-   `options` **[Object][29]** 
    -   `options.token` **[Object][29]** Api token

### Examples

```javascript
const ZeitApiClient = require("zeit-api-client")
const ZEIT_TOKEN = "your_zeit_now_token" // process.env.ZEIT_TOKEN
const zeitApi = new ZeitApiClient({token:ZEIT_TOKEN})
```

### getUser

Get the authenticated user

Official Documentation:
[https://zeit.co/docs/api#endpoints/user][30]

#### Examples

```javascript
const user = zeitApi.getUser()
```

### createDeployment

Create a new deployment with all the required and intended data.

Official Documentation:
[https://zeit.co/docs/api#endpoints/deployments/list-deployments][31]

#### Parameters

-   `data` **[Object][29]** 
    -   `data.name` **[String][32]** A string with the project name used in the deployment URL. The name string has a max length of 52 characters.
    -   `data.files` **[Array][33]** A list of objects with the files to be deployed.
    -   `data.version` **[Number][34]** The version of Now Platform to use. Must have the value of 2.
    -   `data.meta` **[Object][29]** An object containing the deployment's metadata. Multiple key-value pairs can be attached to a deployment. For example, { "foo": "bar" }.
    -   `data.env` **[Object][29]** An object containing the deployment's environment variable names and values. Secrets can be referenced by prefixing the value with @.
    -   `data.builds` **[Array][33]** A list of Build objects used to build sources in a deployment. For example, {[{ "src": "*.php", "use": "@now/php" }]}.
    -   `data.routes` **[Array][33]** A list of routes objects used to rewrite paths to point towards other internal or external paths. For example; [{ "src": "/docs", "dest": "https://docs.zeit.co" }].
    -   `data.regions` **[Array][33]** An array of the regions the deployment should be deployed to. For example, ["sfo", "bru"].
    -   `data.public` **[Boolean][35]** Whether a deployment's source and logs are available publicly.
    -   `data.target` **[String][32]** Either not defined, staging or production. If staging, a staging alias in the format <project>.<team>.now.sh will be assigned. If production, any aliases defined in alias will be assigned.
    -   `data.alias` **[Array][33]** Aliases that will get assigned when the deployment is READY and the target is production. The client needs to make a GET request to this API to ensure the assignment.

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
[https://zeit.co/docs/api#endpoints/deployments/list-deployments][31]

#### Parameters

-   `options` **[Object][29]** 
    -   `options.limit` **[Number][34]** Maximum number of deployments to list from a request. (default: 5, max: 100)
    -   `options.from` **Timestamp** Get the deployment created after this Date timestamp. (default: current time)
    -   `options.projectId` **[String][32]** Filter deployments from the given `projectId`
    -   `options.meta-null` **[String][32]** [KEY] Filter deployments by the given meta key value pairs. e.g., `meta-githubDeployment=1`

### getDeployment

Fetch single deployment by id

Official Documentation:
[https://zeit.co/docs/api#endpoints/deployments/get-a-single-deployment][36]

#### Parameters

-   `deploymentId` **[String][32]** deployment id

### getDeploymentFiles

Fetch a list of deployments files

Official Documentation:
[https://zeit.co/docs/api#endpoints/deployments/list-deployment-files][37]

#### Parameters

-   `deploymentId` **[String][32]** deployment id

### getDeploymentFile

Fetch a single file by deployment and file id

Official Documentation:
[https://zeit.co/docs/api#endpoints/deployments/list-deployment-files][37]

#### Parameters

-   `deploymentId` **[String][32]** deployment id
-   `fileId`  

### deleteDeployment

Delete a single deployment by id

Official Documentation:
[https://zeit.co/docs/api#endpoints/deployments/delete-a-deployment][38]

#### Parameters

-   `deploymentId` **[String][32]** deployment id

### getLogs

Get the logs of a deployment by its ID.

Official Documentation:
[https://zeit.co/docs/api#endpoints/logs][39]

#### Parameters

-   `deploymentId` **[String][32]** deployment id

### getAliases

Fetch all aliases

Official Documentation:
[https://zeit.co/docs/api#endpoints/aliases/list-all-the-aliases][40]

#### Parameters

-   `options` **[Object][29]** 
    -   `options.limit` **[Number][34]** Maximum number of aliases to list from a request. (default: 5, max: 100)
    -   `options.from` **Timestamp** Get the aliases created after this Date timestamp. (default: current time)
    -   `options.projectId` **[String][32]** Filter aliases from the given `projectId`

### getDeploymentAliases

Fetch a deployment's aliases

Official Documentation:
[https://zeit.co/docs/api#endpoints/aliases/list-aliases-by-deployment][41]

#### Parameters

-   `deploymentId` **[String][32]** Id of deployment to fetch aliases from

### getSecrets

Fetch all secrets

Official Documentation:
[https://zeit.co/docs/api#endpoints/secrets/list-all-the-secrets][42]

### getTeams

Fetch all teams

Official Documentation:
[https://zeit.co/docs/api#endpoints/teams/list-all-your-teams][43]

### getProjects

Fetch all projects

Official Documentation:
[https://zeit.co/docs/api#endpoints/projects/get-all-projects][44]

#### Parameters

-   `options` **[Object][29]** 
    -   `options.limit` **[Number][34]** Limit the number of projects returned
    -   `options.from` **Timestamp** The updatedAt point where the list should start.
    -   `options.search` **[String][32]** Search projects by the name field.

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

[21]: #getaliases

[22]: #parameters-8

[23]: #getdeploymentaliases

[24]: #parameters-9

[25]: #getsecrets

[26]: #getteams

[27]: #getprojects

[28]: #parameters-10

[29]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object

[30]: https://zeit.co/docs/api#endpoints/user

[31]: https://zeit.co/docs/api#endpoints/deployments/list-deployments

[32]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String

[33]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array

[34]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number

[35]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean

[36]: https://zeit.co/docs/api#endpoints/deployments/get-a-single-deployment

[37]: https://zeit.co/docs/api#endpoints/deployments/list-deployment-files

[38]: https://zeit.co/docs/api#endpoints/deployments/delete-a-deployment

[39]: https://zeit.co/docs/api#endpoints/logs

[40]: https://zeit.co/docs/api#endpoints/aliases/list-all-the-aliases

[41]: https://zeit.co/docs/api#endpoints/aliases/list-aliases-by-deployment

[42]: https://zeit.co/docs/api#endpoints/secrets/list-all-the-secrets

[43]: https://zeit.co/docs/api#endpoints/teams/list-all-your-teams

[44]: https://zeit.co/docs/api#endpoints/projects/get-all-projects


## License

MIT © [Luka Kakia](https://github.com/manguluka)
