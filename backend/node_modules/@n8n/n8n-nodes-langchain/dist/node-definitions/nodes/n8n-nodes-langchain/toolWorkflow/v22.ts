/**
 * Call n8n Workflow Tool Node - Version 2.2
 * Uses another n8n workflow as a tool. Allows packaging any n8n node(s) as a tool.
 */


export interface LcToolWorkflowV22Params {
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

interface LcToolWorkflowV22NodeBase {
  type: '@n8n/n8n-nodes-langchain.toolWorkflow';
  version: 2.2;
  isTrigger: true;
}

export type LcToolWorkflowV22ParamsNode = LcToolWorkflowV22NodeBase & {
  config: NodeConfig<LcToolWorkflowV22Params>;
};

export type LcToolWorkflowV22Node = LcToolWorkflowV22ParamsNode;