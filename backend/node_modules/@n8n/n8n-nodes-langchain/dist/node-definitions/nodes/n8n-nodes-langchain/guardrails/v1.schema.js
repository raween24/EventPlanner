/**
 * Guardrails Node - Version 1 - Zod Validation Schemas
 *
 * These schemas validate node configuration at runtime.
 * Use .parse() for strict validation or .safeParse() for error handling.
 *
 * Schema helpers (z, expressionSchema, etc.) are passed as parameters
 * by the schema-validator, not imported from external files.
 *
 * @generated - CommonJS JavaScript for runtime loading
 */

module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema, languageModelInstanceSchema }) {

  // Static subnode schema
  const subnodesSchema = z.object({
    model: z.union([languageModelInstanceSchema, z.array(languageModelInstanceSchema)]).optional(),
  }).strict();

  // Parameters schema
  const parametersSchema = z.object({
    operation: z.union([z.literal('classify'), z.literal('sanitize')]).optional(),
    text: stringOrExpression.optional(),
    guardrails: z.object({ keywords: stringOrExpression.optional(), jailbreak: z.unknown().optional(), nsfw: z.unknown().optional(), pii: z.unknown().optional(), secretKeys: z.unknown().optional(), topicalAlignment: z.unknown().optional(), urls: z.unknown().optional(), custom: z.unknown().optional(), customRegex: z.unknown().optional() }).optional(),
    customizeSystemMessage: resolveSchema({ parameters, schema: booleanOrExpression, required: false, displayOptions: {"show":{"/operation":["classify"]}} }),
    systemMessage: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: {"show":{"/customizeSystemMessage":[true]}} }),
  });

  // Return combined config schema
  return z.object({
    parameters: parametersSchema.optional(),
    subnodes: subnodesSchema.optional(),
  });
};