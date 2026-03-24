export type SdkReferenceSection = 'patterns' | 'expressions' | 'functions' | 'rules' | 'import' | 'guidelines' | 'design' | 'all';
export declare function getSdkReferenceContent(section?: SdkReferenceSection): string;
