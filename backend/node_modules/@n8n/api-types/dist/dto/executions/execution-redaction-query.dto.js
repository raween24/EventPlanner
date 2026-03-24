"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecutionRedactionQueryDtoSchema = void 0;
const zod_1 = require("zod");
const boolean_from_string_1 = require("../../schemas/boolean-from-string");
exports.ExecutionRedactionQueryDtoSchema = zod_1.z
    .object({
    redactExecutionData: boolean_from_string_1.booleanFromString.optional(),
})
    .passthrough();
//# sourceMappingURL=execution-redaction-query.dto.js.map