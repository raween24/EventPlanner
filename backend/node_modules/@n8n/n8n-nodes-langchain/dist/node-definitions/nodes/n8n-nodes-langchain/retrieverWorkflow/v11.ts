/**
 * Workflow Retriever Node - Version 1.1
 * Use an n8n Workflow as Retriever
 */


export interface LcRetrieverWorkflowV11Params {
/**
 * Where to get the workflow to execute from
 * @default database
 */
    source?: 'database' | 'parameter' | Expression<string>;
/**
 * The workflow to execute
 * @displayOptions.show { source: ["database"] }
 */
    workflowId?: string | Expression<string> | PlaceholderValue;
/**
 * The workflow JSON code to execute
 * @displayOptions.show { source: ["parameter"] }
 */
    workflowJson?: IDataObject | string | Expression<string>;
/**
 * Set the values which should be made available in the workflow
 * @default {}
 */
    fields?: {
        /** Values
     */
    values?: Array<{
      /** Name of the field to set the value of. Supports dot-notation. Example: data.person[0].name.
       */
      name?: string | Expression<string> | PlaceholderValue;
      /** The field value type
       * @default stringValue
       */
      type?: 'stringValue' | 'numberValue' | 'booleanValue' | 'arrayValue' | 'objectValue' | Expression<string>;
      /** Value
       * @displayOptions.show { type: ["stringValue"] }
       */
      stringValue?: string | Expression<string> | PlaceholderValue;
      /** Value
       * @displayOptions.show { type: ["numberValue"] }
       */
      numberValue?: string | Expression<string> | PlaceholderValue;
      /** Value
       * @displayOptions.show { type: ["booleanValue"] }
       * @default true
       */
      booleanValue?: 'true' | 'false' | Expression<string>;
      /** Value
       * @displayOptions.show { type: ["arrayValue"] }
       */
      arrayValue?: string | Expression<string> | PlaceholderValue;
      /** Value
       * @displayOptions.show { type: ["objectValue"] }
       * @default ={}
       */
      objectValue?: IDataObject | string | Expression<string>;
    }>;
  };
}

interface LcRetrieverWorkflowV11NodeBase {
  type: '@n8n/n8n-nodes-langchain.retrieverWorkflow';
  version: 1.1;
  isTrigger: true;
}

export type LcRetrieverWorkflowV11ParamsNode = LcRetrieverWorkflowV11NodeBase & {
  config: NodeConfig<LcRetrieverWorkflowV11Params>;
};

export type LcRetrieverWorkflowV11Node = LcRetrieverWorkflowV11ParamsNode;