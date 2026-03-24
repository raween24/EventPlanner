/**
 * OpenAI Node - Version 2.1 - Zod Schema
 * Discriminator: resource=image, operation=edit
 *
 * Use .parse() for strict validation or .safeParse() for error handling.
 *
 * Schema helpers (z, expressionSchema, etc.) are passed as parameters
 * by the schema-validator, not imported from external files.
 *
 * @generated - CommonJS JavaScript for runtime loading
 */

module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema, toolInstanceSchema, memoryInstanceSchema }) {

  // Static subnode schema
  const subnodesSchema = z.object({
    tools: z.array(toolInstanceSchema).optional(),
    memory: memoryInstanceSchema.optional(),
  }).strict();

  return z.object({
    parameters: z.object({
      resource: z.literal('image'),
      operation: z.literal('edit'),
      model: z.union([z.literal('dall-e-2'), z.literal('gpt-image-1'), expressionSchema]).optional(),
      prompt: stringOrExpression.optional(),
      images: resolveSchema({ parameters, schema: z.object({ values: z.array(z.object({ binaryPropertyName: stringOrExpression.optional() })).optional() }), required: false, displayOptions: {"show":{"/model":["gpt-image-1"]}} }),
      binaryPropertyName: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: {"show":{"/model":["dall-e-2"]}} }),
      n: numberOrExpression.optional(),
      size: z.union([z.literal('256x256'), z.literal('512x512'), z.literal('1024x1024'), z.literal('1024x1536'), z.literal('1536x1024'), z.literal('auto'), expressionSchema]).optional(),
      quality: resolveSchema({ parameters, schema: z.union([z.literal('auto'), z.literal('high'), z.literal('medium'), z.literal('low'), z.literal('standard'), expressionSchema]), required: false, displayOptions: {"show":{"/model":["gpt-image-1"]}} }),
      responseFormat: resolveSchema({ parameters, schema: z.union([z.literal('url'), z.literal('b64_json'), expressionSchema]), required: false, displayOptions: {"show":{"/model":["dall-e-2"]}} }),
      outputFormat: resolveSchema({ parameters, schema: z.union([z.literal('png'), z.literal('jpeg'), z.literal('webp'), expressionSchema]), required: false, displayOptions: {"show":{"/model":["gpt-image-1"]}} }),
      outputCompression: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: {"show":{"/model":["gpt-image-1"],"outputFormat":["webp","jpeg"]}}, defaults: {"outputFormat":"png"} }),
      options: z.object({ user: stringOrExpression.optional(), background: z.union([z.literal('auto'), z.literal('transparent'), z.literal('opaque'), expressionSchema]).optional(), inputFidelity: z.union([z.literal('low'), z.literal('high'), expressionSchema]).optional(), imageMask: stringOrExpression.optional() }).optional(),
    }).optional(),
    subnodes: subnodesSchema.optional(),
  });
};