/**
 * LangChain Code Node - Version 1 - Zod Validation Schemas
 *
 * These schemas validate node configuration at runtime.
 * Use .parse() for strict validation or .safeParse() for error handling.
 *
 * Schema helpers (z, expressionSchema, etc.) are passed as parameters
 * by the schema-validator, not imported from external files.
 *
 * @generated - CommonJS JavaScript for runtime loading
 */

module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, documentLoaderInstanceSchema, embeddingInstanceSchema, languageModelInstanceSchema, memoryInstanceSchema, outputParserInstanceSchema, textSplitterInstanceSchema, toolInstanceSchema, vectorStoreInstanceSchema }) {

  // Static subnode schema
  const subnodesSchema = z.object({
    documentLoader: z.union([documentLoaderInstanceSchema, z.array(documentLoaderInstanceSchema)]).optional(),
    embedding: z.union([embeddingInstanceSchema, z.array(embeddingInstanceSchema)]).optional(),
    model: z.union([languageModelInstanceSchema, z.array(languageModelInstanceSchema)]).optional(),
    memory: memoryInstanceSchema.optional(),
    outputParser: outputParserInstanceSchema.optional(),
    textSplitter: textSplitterInstanceSchema.optional(),
    tools: z.array(toolInstanceSchema).optional(),
    vectorStore: vectorStoreInstanceSchema.optional(),
  }).strict();

  // Parameters schema
  const parametersSchema = z.object({
    code: z.object({ execute: z.object({ code: z.string().optional() }).optional(), supplyData: z.object({ code: z.string().optional() }).optional() }).optional(),
    inputs: z.object({ input: z.array(z.object({ type: z.union([z.literal('ai_chain'), z.literal('ai_document'), z.literal('ai_embedding'), z.literal('ai_languageModel'), z.literal('ai_memory'), z.literal('ai_outputParser'), z.literal('ai_textSplitter'), z.literal('ai_tool'), z.literal('ai_vectorStore'), z.literal('main')]).optional(), maxConnections: z.number().optional(), required: z.boolean().optional() })).optional() }).optional(),
    outputs: z.object({ output: z.array(z.object({ type: z.union([z.literal('ai_chain'), z.literal('ai_document'), z.literal('ai_embedding'), z.literal('ai_languageModel'), z.literal('ai_memory'), z.literal('ai_outputParser'), z.literal('ai_textSplitter'), z.literal('ai_tool'), z.literal('ai_vectorStore'), z.literal('main')]).optional() })).optional() }).optional(),
  });

  // Return combined config schema
  return z.object({
    parameters: parametersSchema.optional(),
    subnodes: subnodesSchema.optional(),
  });
};