/**
 * Call n8n Workflow Tool Node - Version 2
 * Uses another n8n workflow as a tool. Allows packaging any n8n node(s) as a tool.
 */


export interface LcToolWorkflowV2Params {
/**
 * The name of the function to be called, could contain letters, numbers, and underscores only
 */
    name?: string | Expression<string> | PlaceholderValue;
  description?: string | Expression<string> | PlaceholderValue;
/**
 * Where to get the workflow to execute from
 * @default database
 */
    source?: 'database' | 'parameter' | Expression<string>;
/**
 * Workflow
 * @displayOptions.show { source: ["database"] }
 */
    workflowId?: unknown;
/**
 * Workflow Inputs
 * @displayOptions.show { source: ["database"] }
 * @displayOptions.hide { workflowId: [""] }
 * @default {"mappingMode":"defineBelow","value":null}
 */
    workflowInputs?: string;
/**
 * The workflow JSON code to execute
 * @displayOptions.show { source: ["parameter"] }
 */
    workflowJson?: IDataObject | string | Expression<string>;
}

interface LcToolWorkflowV2NodeBase {
  type: '@n8n/n8n-nodes-langchain.toolWorkflow';
  version: 2;
  isTrigger: true;
}

export type LcToolWorkflowV2ParamsNode = LcToolWorkflowV2NodeBase & {
  config: NodeConfig<LcToolWorkflowV2Params>;
};

export type LcToolWorkflowV2Node = LcToolWorkflowV2ParamsNode;