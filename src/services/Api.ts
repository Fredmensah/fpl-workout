const axios = require('axios');
const resources = require("../config/resources.json");
const apis = require("../config/apis.json");
const env = require("../config/environments.json");

export class Api {
    resource: string;
    primaryKeyName: string;
    parentResources: [];
    environment: string;
    apiConfig: { scheme: string, basePath: string, prefix: string };
    version: string
    //otherHeaders: {};

    constructor(resourceName: string, version: string = 'v3') {
        const resourceConfig = resources[resourceName];

        const { resource, primaryKeyName, parentResources } = resourceConfig;

        this.resource = resource;
        this.version = version;
        this.primaryKeyName = primaryKeyName;
        this.parentResources = parentResources || [];
        this.environment = env.NODE_ENV;
        this.apiConfig = apis["interview"][this.environment][version];
    }

    fullUrl(parentParams = {}) {
        // companies/{company_id}/branches/{branch_id}/products
        const { scheme, basePath } = this.apiConfig;
        let fullPath = `${scheme}://${basePath}/${this.version}/`;

        this.parentResources.forEach((parentResource) => {
            fullPath = `${fullPath}/${parentResource}/${parentParams[parentResource]}`;
        });

        return fullPath;
    }

    get headers() {
        let envHeaders = env.headers;
        envHeaders = {
            ...envHeaders,
            ...{
                "Content-Type": "application/json",
                Accept: "application/json",
            }
        };
        return envHeaders;
    }

    async index(
        parentResources = {},
        config = {},
        requestPath = `${this.fullUrl(parentResources)}/${this.resource}`,
        name = '',
        queryParams = {},
        headers = this.headers,
        otherHeaders = {}
    ) {
        return axios.get(requestPath, {
            params: queryParams,
            headers: { ...headers, ...config, ...otherHeaders },
            onDownloadProgress(progressEvent: { loaded: number; total: number; }) {
                const percentCompleted: number = Math.floor(
                    (progressEvent.loaded * 100) / progressEvent.total
                );

                localStorage.setItem('currentRequestName', name);
                localStorage.setItem('currentRequestProgress', JSON.stringify(percentCompleted));
            }
        });
    }
}
