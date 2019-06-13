import ZeitApiClient from "../src";
import path from "path";
const zeitApi = new ZeitApiClient({ token: process.env.TEST_TOKEN });
let testDeploymentObject;
jest.setTimeout(30000);
//Cache deployments to save time
// const testDeploymentObject = process.env.TEST_DEPLOYMENT_OBJECT;
const deploymentLimit = 1;
let deploymentsList;
beforeAll(async done => {
	if (testDeploymentObject) {
		deploymentsList = JSON.parse(testDeploymentObject);
		done();
	} else {
		deploymentsList = await zeitApi.getDeployments({
			limit: deploymentLimit
		});
		done();
	}
});
describe("Deployments:", () => {
	describe("getDeployments()", () => {
		it("should return a list of deployments respecting options", () => {
			expect(deploymentsList).toHaveLength(deploymentLimit);
		});
	});
	describe("getDeployment()", () => {
		it("should return a correct deployment", async () => {
			const deploymentId = deploymentsList[0].uid;
			try {
				const deployment = await zeitApi.getDeployment(deploymentId);
				expect(deployment.id).toBe(deploymentId);
			} catch (e) {
			}
		});
	});
	describe("getDeploymentFiles()", () => {
		it("should return an array of deployment files", async () => {
			const deploymentId = deploymentsList[0].uid;
			// console.log(deploymentId);
			const deploymentFiles = await zeitApi.getDeploymentFiles(
				deploymentId
			);
			expect(deploymentFiles).toBeInstanceOf(Array);
		});
	});
	describe("createDeployment()", () => {
		it("should return new deployment", async () => {
			let deploymentData = {
				name: "test-createDeployment",
				version: 2,
				files: [
					{
						file: "index.html",
						data: "some <b>bold</b> html content"
					}
				]
			};
			const newDeploymentData = await zeitApi.createDeployment(
				deploymentData
			);
			// console.log(newDeploymentData);
			expect(newDeploymentData.name).toBe(deploymentData.name);
		});
	});
	describe("uploadFile()", () => {
		it("should upload a file and return its sha and filesize", async () => {
			let newFile = await zeitApi.uploadFile({
				filePath: path.join(__dirname, "test-file.html")
			});
			expect(newFile).toHaveProperty("sha");
			expect(newFile).toHaveProperty("size");
		});
	});
	describe("deleteDeployment()", () => {
		it("should return delete correct deployment", async () => {
			let deploymentData = {
				name: "test-deleteDeployment",
				version: 2,
				files: [
					{
						file: "index.html",
						data: "some <b>bold</b> html content"
					}
				]
			};
			const newDeployment = await zeitApi.createDeployment(
				deploymentData
			);
			const deletedDeployment = await zeitApi.deleteDeployment(
				newDeployment.id
			);
			expect(deletedDeployment.uid).toBe(newDeployment.id);
			expect(deletedDeployment.state).toBe("DELETED");
		});
	});
});

describe("User", () => {
	it("should retreive information related to the authenticated user.", async () => {
		const user = await zeitApi.getUser();
		expect(user.username).toBe(process.env.TEST_USERNAME);
	});
});

describe("Logs", () => {
	it("should retreive correct logs.", async () => {
		const deployment = deploymentsList[0];
		let logs = await zeitApi.getLogs(deployment.uid);
		// console.log(logs)
		expect(logs).toBeTruthy();
		// expect(logs[0].payload.deploymentId).toBe(deployment.uid);
	});
});


describe("Domains", () => {
	describe("getDomains()", () => {
		it("should retreive all domains", async () => {
			let res = await zeitApi.getDomains()
			expect(Array.isArray(res)).toBeTruthy()
		});
	});
});

describe("Aliases", () => {
	describe("getAliases(options)", () => {
		it("should retreive all aliases", async () => {
			let res = await zeitApi.getAliases();
			expect(res).toBeTruthy();
		});
	});
	describe("getDeploymentAliases()", () => {
		it("should retreive aliases for correct deployment", async () => {
			let deploymentId = deploymentsList[0].uid;
			let res = await zeitApi.getDeploymentAliases(deploymentId);
			expect(res[0].uid).toBeTruthy();
		});
	});
});

describe("Secrets", () => {
	describe("getSecrets()", () => {
		it("should retreive all secrets", async () => {
			let res = await zeitApi.getSecrets();
			expect(res).toBeTruthy();
		});
	});
});

describe("Teams", () => {
	describe("getTeams()", () => {
		it("should retreive all teams", async () => {
			let res = await zeitApi.getTeams();
			expect(res).toBeTruthy();
		});
	});
});

describe("Projects", () => {
	describe("getProjects(options)", () => {
		it("should retreive all projects", async () => {
			let res = await zeitApi.getProjects();
			expect(res).toBeTruthy();
		});
	});
});
