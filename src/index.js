import axios from "axios";
import sha1 from "simple-sha1";
import fs from "fs";
const getQueryStr = obj => {
	if (obj) {
		const queryStr = Object.keys(obj)
			.filter(k => obj[k])
			.map(k => `${k}=${obj[k]}`)
			.join("&");

		return queryStr ? `?${queryStr}` : "";
	} else {
		return "";
	}
};

/**
 *
 * @param {Object} options
 * @param {Object} options.token Api token
 * @example
 * const ZeitApiClient = require("zeit-api-client")
 * const ZEIT_TOKEN = "your_zeit_now_token" // process.env.ZEIT_TOKEN
 * const zeitApi = new ZeitApiClient({token:ZEIT_TOKEN})
 */
class ZeitApiClient {
	constructor(options) {
		this.token = options.token;
		this.client = axios.create({
			baseURL: `https://api.zeit.co`,
			headers: {
				Authorization: `Bearer ${this.token}`
			}
		});
	}
	/**
	 * Get the authenticated user
	 *
	 * Official Documentation:
	 * https://zeit.co/docs/api#endpoints/user
	 *
	 * @example
	 *
	 * const user = zeitApi.getUser()
	 */
	async getUser() {
		const endpointPath = `/www/user`;
		const res = await this.client.get(endpointPath);
		return res.data.user;
	}
	//Deployments
	/**
	 * Create a new deployment with all the required and intended data.
	 *
	 * Official Documentation:
	 * https://zeit.co/docs/api#endpoints/deployments/list-deployments
	 *
	 * @param {Object} data
	 * @param {Object} data.build.env An object containing the deployment's environment variable names and values to be passed to Builds. Secrets can be referenced by prefixing the value with @.
	 * @param {String} data.name A string with the project name used in the deployment URL. The name string has a max length of 52 characters.
	 * @param {Array} data.files A list of objects with the files to be deployed.
	 * @param {Number} data.version  The version of Now Platform to use. Must have the value of 2.
	 * @param {Object} data.meta An object containing the deployment's metadata. Multiple key-value pairs can be attached to a deployment. For example, { "foo": "bar" }.
	 * @param {Object} data.env An object containing the deployment's environment variable names and values. Secrets can be referenced by prefixing the value with @.
	 * @param {Array} data.builds A list of Build objects used to build sources in a deployment. For example, {[{ "src": "*.php", "use": "@now/php" }]}.
	 * @param {Array} data.routes A list of routes objects used to rewrite paths to point towards other internal or external paths. For example; [{ "src": "/docs", "dest": "https://docs.zeit.co" }].
	 * @param {Array} data.regions An array of the regions the deployment should be deployed to. For example, ["sfo", "bru"].
	 * @param {Boolean} data.public Whether a deployment's source and logs are available publicly.
	 * @param {String} data.target Either not defined, staging or production. If staging, a staging alias in the format <project>.<team>.now.sh will be assigned. If production, any aliases defined in alias will be assigned.
	 * @param {Array} data.alias Aliases that will get assigned when the deployment is READY and the target is production. The client needs to make a GET request to this API to ensure the assignment.
	 * @example
	 * const deploymentData = {
	 *   "name": "my-instant-deployment",
	 *   "version": 2,
	 *   "files": [
	 *     {
	 *       "file": "index.html",
	 *       "data": "<!doctype html>\n<html>\n  <head>\n    <title>A simple deployment with the Now API!</title>\n  </head>\n  <body>\n    <h1>Welcome to a simple static file</h1>\n    <p>Deployed with <a href=\"https://zeit.co/docs/api\">ZEIT&apos;s Now API</a>!</p>\n    </body>\n</html>"
	 *     }
	 *   ]
	 * }
	 * const newDeployment = zeitApi.createDeployment(deploymentData)
	 */
	async createDeployment(data) {
		const endpointPath = `/v9/now/deployments/`;
		const res = await this.client.post(endpointPath, data);
		return res.data;
	}
	/**
	 * Uploads a file and returns its size and sha if successful (currently only works in node). Returned object can be used with `createDeployment()` files section
	 *
	 * Official Documentation:
	 * https://zeit.co/docs/api#endpoints/deployments/upload-deployment-files
	 *
	 * @param {Object} options
	 * @param {String} options.filePath Path pf file to upload
	 *
	 * @returns {Object} fileData 
	 * @returns {String} fileData.sha sha1 hash of uploaded file
	 * @returns {String} fileData.size size in bytes of uploaded file
	 */
	async uploadFile(options) {
		const { filePath } = options;
		if (options.filePath) {
			const fileData = fs.readFileSync(filePath);
			const fileSize = fs.statSync(filePath).size;
			const fileHash = sha1.sync(fileData);

			const queryStr = getQueryStr(options);

			const endpointPath = `/v2/now/files`;
			const res = await this.client.post(endpointPath, fileData, {
				headers: {
					"Content-Length": fileSize,
					"x-now-digest": fileHash
				}
			});
			if (res.status === 200) {
				return { sha: fileHash, size: fileSize };
			}
		} 
	}
	/**
	 * Fetch all deployments
	 *
	 * Official Documentation:
	 * https://zeit.co/docs/api#endpoints/deployments/list-deployments
	 *
	 * @param {Object} options
	 * @param {Number} options.limit Maximum number of deployments to list from a request. (default: 5, max: 100)
	 * @param {Timestamp} options.from Get the deployment created after this Date timestamp. (default: current time)
	 * @param {String} options.projectId Filter deployments from the given `projectId`
	 * @param {String} options.meta-[KEY] Filter deployments by the given meta key value pairs. e.g., `meta-githubDeployment=1`
	 */
	async getDeployments(options) {
		const queryStr = getQueryStr(options);
		const endpointPath = `/v4/now/deployments${queryStr}`;
		const res = await this.client.get(endpointPath);
		return res.data.deployments;
	}
	/**
	 * Fetch single deployment by id
	 *
	 * Official Documentation:
	 * https://zeit.co/docs/api#endpoints/deployments/get-a-single-deployment
	 *
	 * @param {String} deploymentId deployment id
	 */
	async getDeployment(deploymentId) {
		const endpointPath = `/v9/now/deployments/${deploymentId}`;
		const res = await this.client.get(endpointPath);
		return res.data;
	}
	/**
	 * Fetch a list of deployments files
	 *
	 * Official Documentation:
	 * https://zeit.co/docs/api#endpoints/deployments/list-deployment-files
	 *
	 * @param {String} deploymentId deployment id
	 */
	async getDeploymentFiles(deploymentId) {
		const endpointPath = `/v5/now/deployments/${deploymentId}/files`;
		const res = await this.client.get(endpointPath);
		return res.data;
	}
	/**
	 * Fetch a single file by deployment and file id
	 *
	 * Official Documentation:
	 * https://zeit.co/docs/api#endpoints/deployments/list-deployment-files
	 *
	 * @param {String} deploymentId deployment id
	 */
	async getDeploymentFile(deploymentId, fileId) {
		const endpointPath = `/v5/now/deployments/${deploymentId}/files/${fileId}`;
		const res = await this.client.get(endpointPath);
		return res.data;
	}
	/**
	 * Delete a single deployment by id
	 *
	 * Official Documentation:
	 * https://zeit.co/docs/api#endpoints/deployments/delete-a-deployment
	 *
	 * @param {String} deploymentId deployment id
	 */
	async deleteDeployment(deploymentId) {
		const endpointPath = `/v9/now/deployments/${deploymentId}`;
		const res = await this.client.delete(endpointPath);
		return res.data;
	}
	//Logs
	/**
	 * Get the logs of a deployment by its ID.
	 *
	 * Official Documentation:
	 * https://zeit.co/docs/api#endpoints/logs
	 *
	 * @param {String} deploymentId deployment id
	 */
	async getLogs(deploymentId) {
		const endpointPath = `/v2/now/deployments/${deploymentId}/events`;
		const res = await this.client.get(endpointPath);
		return res.data;
	}
	//Aliases
	/**
	 * Fetch all aliases
	 *
	 * Official Documentation:
	 * https://zeit.co/docs/api#endpoints/aliases/list-all-the-aliases
	 *
	 * @param {Object} options
	 * @param {Number} options.limit Maximum number of aliases to list from a request. (default: 5, max: 100)
	 * @param {Timestamp} options.from Get the aliases created after this Date timestamp. (default: current time)
	 * @param {String} options.projectId Filter aliases from the given `projectId`
	 */
	async getAliases(options) {
		const endpointPath = `/v2/now/aliases`;
		const res = await this.client.get(endpointPath);
		return res.data;
	}
	/**
	 * Fetch a deployment's aliases
	 *
	 * Official Documentation:
	 * https://zeit.co/docs/api#endpoints/aliases/list-aliases-by-deployment
	 *
	 * @param {String} deploymentId Id of deployment to fetch aliases from
	 */
	async getDeploymentAliases(deploymentId) {
		const endpointPath = `/v2/now/deployments/${deploymentId}/aliases`;
		const res = await this.client.get(endpointPath);
		return res.data.aliases;
	}
	//Secrets
	/**
	 * Fetch all secrets
	 *
	 * Official Documentation:
	 * https://zeit.co/docs/api#endpoints/secrets/list-all-the-secrets
	 *
	 */
	async getSecrets() {
		const endpointPath = `/v2/now/secrets`;
		const res = await this.client.get(endpointPath);
		return res.data.secrets;
	}
	//Teams
	/**
	 * Fetch all teams
	 *
	 * Official Documentation:
	 * https://zeit.co/docs/api#endpoints/teams/list-all-your-teams
	 *
	 */
	async getTeams() {
		const endpointPath = `/v2/teams`;
		const res = await this.client.get(endpointPath);
		return res.data.teams;
	}
	//Projects
	/**
	 * Fetch all projects
	 *
	 * Official Documentation:
	 * https://zeit.co/docs/api#endpoints/projects/get-all-projects
	 *
	 * @param {Object} options
	 * @param {Number} options.limit Limit the number of projects returned
	 * @param {Timestamp} options.from The updatedAt point where the list should start.
	 * @param {String} options.search Search projects by the name field.

	 */
	async getProjects(options) {
		const queryStr = getQueryStr(options);
		const endpointPath = `/v1/projects/list${queryStr}`;
		const res = await this.client.get(endpointPath);
		return res.data;
	}
}

export default ZeitApiClient;
