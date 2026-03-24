import { type IDataObject, type ILoadOptionsFunctions, type NodeParameterValueType } from 'n8n-workflow';
declare const ChatHubVectorStoreQdrant_base: new () => {
    description: import("n8n-workflow").INodeTypeDescription;
    methods: {
        listSearch?: {
            [key: string]: (this: import("n8n-workflow").ILoadOptionsFunctions, filter?: string, paginationToken?: string) => Promise<import("n8n-workflow").INodeListSearchResult>;
        };
        actionHandler?: {
            [functionName: string]: (this: import("n8n-workflow").ILoadOptionsFunctions, payload: import("n8n-workflow").IDataObject | string | undefined) => Promise<import("n8n-workflow").NodeParameterValueType>;
        };
        credentialTest?: {
            [functionName: string]: import("n8n-workflow").ICredentialTestFunction;
        };
    } | undefined;
    execute(this: import("n8n-workflow").IExecuteFunctions): Promise<import("n8n-workflow").INodeExecutionData[][]>;
    supplyData(this: import("n8n-workflow").ISupplyDataFunctions, itemIndex: number): Promise<import("n8n-workflow").SupplyData>;
};
export declare class ChatHubVectorStoreQdrant extends ChatHubVectorStoreQdrant_base {
}
export {};
