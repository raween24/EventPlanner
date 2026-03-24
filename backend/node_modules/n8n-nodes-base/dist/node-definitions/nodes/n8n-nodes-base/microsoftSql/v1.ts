/**
 * Microsoft SQL Node - Version 1
 * Get, add and update data in Microsoft SQL
 */


export interface MicrosoftSqlV1Params {
  operation?: 'executeQuery' | 'insert' | 'update' | 'delete';
/**
 * The SQL query to execute
 * @displayOptions.show { operation: ["executeQuery"] }
 */
    query?: string;
/**
 * Name of the table in which to insert data to
 * @displayOptions.show { operation: ["insert"] }
 */
    table?: string | Expression<string> | PlaceholderValue;
/**
 * Comma-separated list of the properties which should used as columns for the new rows
 * @displayOptions.show { operation: ["insert"] }
 */
    columns?: string | Expression<string> | PlaceholderValue;
/**
 * Name of the property which decides which rows in the database should be updated. Normally that would be "id".
 * @displayOptions.show { operation: ["update"] }
 * @default id
 */
    updateKey?: string | Expression<string> | PlaceholderValue;
/**
 * Name of the property which decides which rows in the database should be deleted. Normally that would be "id".
 * @displayOptions.show { operation: ["delete"] }
 * @default id
 */
    deleteKey?: string | Expression<string> | PlaceholderValue;
}

export interface MicrosoftSqlV1Credentials {
  microsoftSql: CredentialReference;
}

interface MicrosoftSqlV1NodeBase {
  type: 'n8n-nodes-base.microsoftSql';
  version: 1;
  credentials?: MicrosoftSqlV1Credentials;
}

export type MicrosoftSqlV1ParamsNode = MicrosoftSqlV1NodeBase & {
  config: NodeConfig<MicrosoftSqlV1Params>;
};

export type MicrosoftSqlV1Node = MicrosoftSqlV1ParamsNode;