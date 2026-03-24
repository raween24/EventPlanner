/**
 * MCP Server Trigger Node - Version 2 - Zod Validation Schemas
 *
 * These schemas validate node configuration at runtime.
 * Use .parse() for strict validation or .safeParse() for error handling.
 *
 * Schema helpers (z, expressionSchema, etc.) are passed as parameters
 * by the schema-validator, not imported from external files.
 *
 * @generated - CommonJS JavaScript for runtime loading
 */

module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, toolInstanceSchema }) {

  // Static subnode schema
  const subnodesSchema = z.object({
    tools: z.array(toolInstanceSchema).optional(),
  }).strict();

  // Parameters schema
  const parametersSchema = z.object({
    authentication: z.union([z.literal('none'), z.literal('bearerAuth'), z.literal('headerAuth'), expressionSchema]).optional(),
    path: stringOrExpression.optional(),
  });

  // Return combined config schema
  return z.object({
    parameters: parametersSchema.optional(),
    subnodes: subnodesSchema.optional(),
  });
};