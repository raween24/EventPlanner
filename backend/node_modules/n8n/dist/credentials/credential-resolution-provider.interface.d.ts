import type { ICredentialDataDecryptedObject, IExecutionContext, IWorkflowSettings } from 'n8n-workflow';
export type CredentialResolveMetadata = {
    id: string;
    name: string;
    type: string;
    resolverId?: string;
    isResolvable: boolean;
};
export type CredentialResolutionResult = {
    data: ICredentialDataDecryptedObject;
    isDynamic: boolean;
};
export interface ICredentialResolutionProvider {
    resolveIfNeeded(credentialsResolveMetadata: CredentialResolveMetadata, staticData: ICredentialDataDecryptedObject, executionContext?: IExecutionContext, workflowSettings?: IWorkflowSettings): Promise<CredentialResolutionResult>;
}
