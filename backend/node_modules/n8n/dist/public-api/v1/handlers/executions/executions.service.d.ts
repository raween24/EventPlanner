import { type AnnotationTagEntity } from '@n8n/db';
export declare function mapAnnotationTags(tags: AnnotationTagEntity[]): {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}[];
export declare function getExecutionTags(executionId: string): Promise<{
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}[]>;
export declare function updateExecutionTags(executionId: string, newTagIds: string[]): Promise<AnnotationTagEntity[]>;
