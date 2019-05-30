const getQueryStr = obj => {
	const queryStr = Object.keys(obj)
		.filter(k => obj[k])
		.map(k => `${k}=${obj[k]}`)
		.join("&");

	return queryStr ? `?${queryStr}` : "";
};

/**
 *
 * @param {Object} zeitClient zeitClient from UIHook
 * @example
 *
 * const {ZeitIUApiClient} = require("zeit-api-client")
 * const zeitApi = new ZeitUiApiClient(zeitClient)
 */
class ZeitIUApiClient {
	constructor(zeitClient) {
		this.client = zeitClient;
	}
	/**
	 * Fetch all deployments
	 *
	 * Official Documentation:
	 * https://zeit.co/docs/api#endpoints/deployments/list-deployments
	 *
	 * @param {Object} options
	 * @param {Object} options.query optional query params
	 * @example
	 *
	 * const {ZeitIUApiClient} = require("zeit-api-client")
	 * const zeitApi = new ZeitUiApiClient(zeitClient)
	 * const deployments = zeitApi.getDeployments()
	 */
	async getDeployments({ query = {} } = {}) {
		const queryStr = getQueryStr(query);
		const endpointPath = `/v4/now/deployments${queryStr}`;
		const { deployments } = await this.client.fetchAndThrow(endpointPath, {
			method: "GET"
		});
		return deployments;
	}
	/**
	 * Fetch single deployment by id
	 *
	 * Official Documentation:
	 * https://zeit.co/docs/api#endpoints/deployments/get-a-single-deployment
	 *
	 * @param {String} id deployment id
	 * @param {Object} options
	 * @param {Object} options.query optional query params
	 * @example
	 *
	 * const {ZeitIUApiClient} = require("zeit-api-client")
	 * const zeitApi = new ZeitIUApiClient(zeitClient)
	 * const deploymentId = "dpl_***"
	 * const deployment = zeitApi.getDeployment(deploymentId)
	 */
	async getDeployment(id, { query = {} } = {}) {
		const queryStr = getQueryStr(query);
		const endpointPath = `/v9/now/deployments/${id}`;
		return await this.client.fetchAndThrow(endpointPath, { method: "GET" });
	}
	/**
	 * Fetch a list of all files in deployment
	 *
	 * Official Documentation:
	 * https://zeit.co/docs/api#endpoints/deployments/list-deployment-files
	 *
	 * @param {String} id deployment id
	 * @param {Object} options
	 * @param {Object} options.query optional query params
	 * @example
	 *
	 * const {ZeitIUApiClient} = require("zeit-api-client")
	 * const zeitApi = new ZeitIUApiClient(zeitClient)
	 * const deploymentId = "dpl_***"
	 * const deployment = zeitApi.getDeploymentFiles(deploymentId)
	 */
	async getDeploymentFiles(id, { query = {} } = {}) {
		const queryStr = getQueryStr(query);
		const endpointPath = `/v5/now/deployments/${id}/files${queryStr}`;
		return await this.client.fetchAndThrow(endpointPath, { method: "GET" });
	}

	/**
	 * Fetch a single file from a deployment
	 *
	 * Official Documentation:
	 * https://zeit.co/docs/api#endpoints/deployments/get-single-file-contents
	 *
	 * @param {String} deploymentId deployment id
	 * @param {String} fileID file id
	 * @param {Object} options
	 * @param {Object} options.query optional query params
	 * @example
	 *
	 * const {ZeitIUApiClient} = require("zeit-api-client")
	 * const zeitApi = new ZeitIUApiClient(zeitClient)
	 * const deploymentId = "dpl_***"
	 * const deployment = zeitApi.getDeploymentFiles(deploymentId)
	 */
	async getDeploymentFile(deploymentId, fileId, { query = {} } = {}) {
		const queryStr = getQueryStr(query);
		const endpointPath = `/v5/now/deployments/${deploymentId}/files/${fileId}${queryStr}`;
		const res = await this.client.fetch(endpointPath, {});
		if (res.status !== 200) {
			throw new Error(
				`Failed ZEIT API call. path: ${endpointPath} status: ${
					res.status
				} error: ${await res.text()}`
			);
		}

		return await res.text();
	}
	/**
	 * Create a new deployment
	 *
	 * Official Documentation:
	 * https://zeit.co/docs/api#endpoints/deployments/create-a-new-deployment
	 *
	 * @param {Object} data POST body data
	 * @example
	 *
	 * const {ZeitIUApiClient} = require("zeit-api-client")
	 * const zeitApi = new ZeitIUApiClient(zeitClient)
	 * const deloymentData = {
	 *   "name": "my-deployment",
	 *   "version": 2,
	 *   "files": [
	 *     {
	 *       "file": "index.html",
	 *       "data": "<!doctype html>\n<html>\n  <head>\n    <title>A simple deployment with the Now API!</title>\n  </head>\n  <body>\n    <h1>Welcome to a simple static file</h1>\n    <p>Deployed with <a href=\"https://zeit.co/docs/api\">ZEIT&apos;s Now API</a>!</p>\n    </body>\n</html>"
	 *     }
	 *   ]
	 * }
	 * const deployment = zeitApi.createDeployment(data)
	 */
	async createDeployment(data) {
		const apiUrl = `/v9/now/deployments`;
		return await this.client.fetchAndThrow(apiUrl, {
			method: "POST",
			data
		});
	}
}
export { ZeitIUApiClient };
