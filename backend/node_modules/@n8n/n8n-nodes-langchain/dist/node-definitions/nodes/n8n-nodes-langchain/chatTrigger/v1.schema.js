/**
 * Chat Trigger Node - Version 1 - Zod Validation Schemas
 *
 * These schemas validate node configuration at runtime.
 * Use .parse() for strict validation or .safeParse() for error handling.
 *
 * Schema helpers (z, expressionSchema, etc.) are passed as parameters
 * by the schema-validator, not imported from external files.
 *
 * @generated - CommonJS JavaScript for runtime loading
 */

module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema, memoryInstanceSchema }) {

  // Helper function for conditional subnode schema
  function getSubnodesSchema() {
    return z.object({
      memory: resolveSchema({ parameters, schema: memoryInstanceSchema, required: true, displayOptions: {"show":{"options.loadPreviousSession":["memory"]}}, defaults: {"options":{}} }),
    }).strict();
  }

  // Parameters schema
  const parametersSchema = z.object({
    public: booleanOrExpression.optional(),
    mode: resolveSchema({ parameters, schema: z.union([z.literal('hostedChat'), z.literal('webhook'), expressionSchema]), required: false, displayOptions: {"show":{"public":[true]}}, defaults: {"public":false} }),
    authentication: resolveSchema({ parameters, schema: z.union([z.literal('basicAuth'), z.literal('n8nUserAuth'), z.literal('none'), expressionSchema]), required: false, displayOptions: {"show":{"public":[true]}}, defaults: {"public":false} }),
    initialMessages: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: {"show":{"mode":["hostedChat"],"public":[true]}}, defaults: {"mode":"hostedChat","public":false} }),
    availableInChat: z.boolean().optional(),
    options: resolveSchema({ parameters, schema: z.object({ allowFileUploads: booleanOrExpression.optional(), allowedFilesMimeTypes: stringOrExpression.optional(), allowedOrigins: stringOrExpression.optional(), inputPlaceholder: stringOrExpression.optional(), loadPreviousSession: z.union([z.literal('notSupported'), z.literal('memory'), z.literal('manually'), expressionSchema]).optional(), showWelcomeScreen: booleanOrExpression.optional(), getStarted: stringOrExpression.optional(), subtitle: stringOrExpression.optional(), title: stringOrExpression.optional(), customCss: stringOrExpression.optional(), responseMode: z.union([z.literal('lastNode'), z.literal('responseNode'), expressionSchema]).optional() }), required: false, displayOptions: {"show":{"public":[false,true],"mode":["hostedChat","webhook"]}}, defaults: {"public":false,"mode":"hostedChat"} }),
  });

  // Return combined config schema
  return z.object({
    parameters: parametersSchema.optional(),
    subnodes: getSubnodesSchema().optional(),
  });
};