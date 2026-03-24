"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapAnnotationTags = mapAnnotationTags;
exports.getExecutionTags = getExecutionTags;
exports.updateExecutionTags = updateExecutionTags;
const db_1 = require("@n8n/db");
const di_1 = require("@n8n/di");
function mapAnnotationTags(tags) {
    return tags.map(({ id: tagId, name, createdAt, updatedAt }) => ({
        id: tagId,
        name,
        createdAt,
        updatedAt,
    }));
}
async function getExecutionTags(executionId) {
    const annotation = await di_1.Container.get(db_1.ExecutionAnnotationRepository).findOne({
        where: { execution: { id: executionId } },
        relations: ['tags'],
    });
    return mapAnnotationTags(annotation?.tags ?? []);
}
async function updateExecutionTags(executionId, newTagIds) {
    const { manager: dbManager } = di_1.Container.get(db_1.ExecutionAnnotationRepository);
    return await dbManager.transaction(async (transactionManager) => {
        await transactionManager.upsert(db_1.ExecutionAnnotation, { execution: { id: executionId } }, [
            'execution',
        ]);
        const annotation = await transactionManager.findOneOrFail(db_1.ExecutionAnnotation, {
            where: { execution: { id: executionId } },
        });
        await transactionManager.delete(db_1.AnnotationTagMapping, {
            annotationId: annotation.id,
        });
        if (newTagIds.length > 0) {
            const tagMappings = newTagIds.map((tagId) => ({
                annotationId: annotation.id,
                tagId,
            }));
            await transactionManager.insert(db_1.AnnotationTagMapping, tagMappings);
        }
        const updatedAnnotation = await transactionManager.findOneOrFail(db_1.ExecutionAnnotation, {
            where: { execution: { id: executionId } },
            relations: ['tags'],
        });
        return updatedAnnotation.tags ?? [];
    });
}
//# sourceMappingURL=executions.service.js.map