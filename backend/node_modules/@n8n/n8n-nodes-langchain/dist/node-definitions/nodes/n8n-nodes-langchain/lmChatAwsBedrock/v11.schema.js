/**
 * AWS Bedrock Chat Model Node - Version 1.1 - Zod Validation Schemas
 *
 * These schemas validate node configuration at runtime.
 * Use .parse() for strict validation or .safeParse() for error handling.
 *
 * Schema helpers (z, expressionSchema, etc.) are passed as parameters
 * by the schema-validator, not imported from external files.
 *
 * @generated - CommonJS JavaScript for runtime loading
 */

module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {

  // Parameters schema
  const parametersSchema = z.object({
    modelSource: z.union([z.literal('onDemand'), z.literal('inferenceProfile'), expressionSchema]).optional(),
    model: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: {"show":{"modelSource":["inferenceProfile"]},"hide":{"modelSource":["inferenceProfile"]}}, defaults: {"modelSource":"onDemand"} }),
    options: z.object({ maxTokensToSample: numberOrExpression.optional(), temperature: numberOrExpression.optional() }).optional(),
  });

  // Return combined config schema
  return z.object({
    parameters: parametersSchema.optional(),
  });
};