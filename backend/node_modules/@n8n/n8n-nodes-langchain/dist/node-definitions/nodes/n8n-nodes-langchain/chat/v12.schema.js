/**
 * Chat Node - Version 1.2 - Zod Validation Schemas
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

  // Static subnode schema
  const subnodesSchema = z.object({
    memory: memoryInstanceSchema.optional(),
  }).strict();

  // Parameters schema
  const parametersSchema = z.object({
    operation: z.union([z.literal('send'), z.literal('sendAndWait')]).optional(),
    message: stringOrExpression.optional(),
    responseType: resolveSchema({ parameters, schema: z.union([z.literal('approval'), z.literal('freeTextChat'), expressionSchema]), required: false, displayOptions: {"show":{"operation":["sendAndWait"]}}, defaults: {"operation":"send"} }),
    blockUserInput: resolveSchema({ parameters, schema: booleanOrExpression, required: false, displayOptions: {"show":{"responseType":["approval"]}}, defaults: {"responseType":"freeTextChat"} }),
    defineForm: resolveSchema({ parameters, schema: z.union([z.literal('fields'), z.literal('json')]), required: false, displayOptions: {"show":{"responseType":["customForm"],"operation":["sendAndWait"]}}, defaults: {"responseType":"freeTextChat","operation":"send"} }),
    jsonOutput: resolveSchema({ parameters, schema: z.union([iDataObjectSchema, z.string()]), required: false, displayOptions: {"show":{"defineForm":["json"],"responseType":["customForm"],"operation":["sendAndWait"]}}, defaults: {"defineForm":"fields","responseType":"freeTextChat","operation":"send"} }),
    formFields: resolveSchema({ parameters, schema: z.object({ values: z.array(z.object({ fieldName: stringOrExpression.optional(), fieldLabel: stringOrExpression.optional(), fieldLabel: stringOrExpression.optional(), fieldName: stringOrExpression.optional(), fieldType: z.union([z.literal('checkbox'), z.literal('html'), z.literal('date'), z.literal('dropdown'), z.literal('email'), z.literal('file'), z.literal('hiddenField'), z.literal('number'), z.literal('password'), z.literal('radio'), z.literal('text'), z.literal('textarea'), expressionSchema]).optional(), elementName: stringOrExpression.optional(), fieldName: stringOrExpression.optional(), placeholder: stringOrExpression.optional(), defaultValue: stringOrExpression.optional(), defaultValue: stringOrExpression.optional(), defaultValue: stringOrExpression.optional(), defaultValue: stringOrExpression.optional(), fieldValue: stringOrExpression.optional(), fieldOptions: z.unknown().optional(), fieldOptions: z.unknown().optional(), fieldOptions: z.unknown().optional(), multiselect: booleanOrExpression.optional(), limitSelection: z.union([z.literal('exact'), z.literal('range'), z.literal('unlimited'), expressionSchema]).optional(), numberOfSelections: numberOrExpression.optional(), minSelections: numberOrExpression.optional(), maxSelections: numberOrExpression.optional(), html: z.string().optional(), multipleFiles: booleanOrExpression.optional(), acceptFileTypes: stringOrExpression.optional(), requiredField: booleanOrExpression.optional() })).optional() }), required: false, displayOptions: {"show":{"defineForm":["fields"],"responseType":["customForm"],"operation":["sendAndWait"]}}, defaults: {"defineForm":"fields","responseType":"freeTextChat","operation":"send"} }),
    approvalOptions: resolveSchema({ parameters, schema: z.object({ values: z.object({ approvalType: z.union([z.literal('single'), z.literal('double'), expressionSchema]).optional(), approveLabel: stringOrExpression.optional(), buttonApprovalStyle: z.union([z.literal('primary'), z.literal('secondary'), expressionSchema]).optional(), disapproveLabel: stringOrExpression.optional(), buttonDisapprovalStyle: z.union([z.literal('primary'), z.literal('secondary'), expressionSchema]).optional() }).optional() }), required: false, displayOptions: {"show":{"responseType":["approval"],"operation":["sendAndWait"]}}, defaults: {"responseType":"freeTextChat","operation":"send"} }),
    options: resolveSchema({ parameters, schema: z.object({ memoryConnection: booleanOrExpression.optional(), limitWaitTime: z.unknown().optional(), limitWaitTime: z.unknown().optional() }), required: false, displayOptions: {"show":{"@tool":[true],"/waitUserReply":[true],"/operation":["sendAndWait"]},"hide":{"@tool":[true]}} }),
  });

  // Return combined config schema
  return z.object({
    parameters: parametersSchema.optional(),
    subnodes: subnodesSchema.optional(),
  });
};