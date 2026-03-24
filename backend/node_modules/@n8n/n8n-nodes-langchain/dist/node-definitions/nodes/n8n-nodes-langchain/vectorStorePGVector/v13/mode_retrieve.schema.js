/**
 * Postgres PGVector Store Node - Version 1.3 - Zod Schema
 * Discriminator: mode=retrieve
 *
 * Use .parse() for strict validation or .safeParse() for error handling.
 *
 * Schema helpers (z, expressionSchema, etc.) are passed as parameters
 * by the schema-validator, not imported from external files.
 *
 * @generated - CommonJS JavaScript for runtime loading
 */

module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema, embeddingInstanceSchema, rerankerInstanceSchema }) {

  // Helper function for conditional subnode schema
  function getSubnodesSchema() {
    return z.object({
      embedding: z.union([embeddingInstanceSchema, z.array(embeddingInstanceSchema)]),
      reranker: resolveSchema({ parameters, schema: rerankerInstanceSchema, required: true, displayOptions: {"show":{"useReranker":[true]}}, defaults: {"useReranker":false} }),
    }).strict();
  }

  return z.object({
    parameters: z.object({
      mode: z.literal('retrieve').default('retrieve'),
      ragStarterCallout: z.unknown().optional(),
      tableName: stringOrExpression.optional(),
      useReranker: booleanOrExpression.optional(),
      options: z.object({ distanceStrategy: z.union([z.literal('cosine'), z.literal('innerProduct'), z.literal('euclidean'), expressionSchema]).optional(), collection: z.unknown().optional(), columnNames: z.unknown().optional(), metadata: z.unknown().optional() }).optional(),
    }).optional(),
    subnodes: getSubnodesSchema(),
  });
};