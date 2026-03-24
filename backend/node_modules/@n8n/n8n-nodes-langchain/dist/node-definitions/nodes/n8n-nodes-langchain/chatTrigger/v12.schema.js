/**
 * Chat Trigger Node - Version 1.2 - Zod Validation Schemas
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
    agentIcon: resolveSchema({ parameters, schema: z.unknown(), required: false, displayOptions: {"show":{"availableInChat":[true]}}, defaults: {"availableInChat":false} }),
    agentName: resolveSchema({ parameters, schema: z.string(), required: false, displayOptions: {"show":{"availableInChat":[true]}}, defaults: {"availableInChat":false} }),
    agentDescription: resolveSchema({ parameters, schema: z.string(), required: false, displayOptions: {"show":{"availableInChat":[true]}}, defaults: {"availableInChat":false} }),
    suggestedPrompts: resolveSchema({ parameters, schema: z.object({ prompts: z.array(z.object({ icon: z.unknown().optional(), text: z.string().optional() })).optional() }), required: false, displayOptions: {"show":{"availableInChat":[true]}}, defaults: {"availableInChat":false} }),
    options: resolveSchema({ parameters, schema: z.object({ allowedOrigins: stringOrExpression.optional(), allowFileUploads: booleanOrExpression.optional(), allowedFilesMimeTypes: stringOrExpression.optional(), inputPlaceholder: stringOrExpression.optional(), loadPreviousSession: z.union([z.literal('notSupported'), z.literal('memory'), z.literal('manually'), expressionSchema]).optional(), showWelcomeScreen: booleanOrExpression.optional(), getStarted: stringOrExpression.optional(), subtitle: stringOrExpression.optional(), title: stringOrExpression.optional(), customCss: stringOrExpression.optional(), responseMode: z.union([z.literal('lastNode'), z.literal('responseNode'), z.literal('streaming'), expressionSchema]).optional(), responseMode: z.union([z.literal('streaming'), z.literal('lastNode'), expressionSchema]).optional() }), required: false, displayOptions: {"show":{"mode":["hostedChat","webhook"],"public":[true]}}, defaults: {"mode":"hostedChat","public":false} }),
  });

  // Return combined config schema
  return z.object({
    parameters: parametersSchema.optional(),
    subnodes: getSubnodesSchema().optional(),
  });
};