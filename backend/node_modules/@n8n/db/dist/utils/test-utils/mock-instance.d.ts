import { type Constructable } from '@n8n/di';
import { mock } from 'jest-mock-extended';
export declare const mockInstance: <T>(serviceClass: Constructable<T>, data?: Parameters<typeof mock<T>>[0]) => { [K in keyof T]: T[K] extends (...args: infer A) => infer B ? import("jest-mock-extended").CalledWithMock<B, A> : T[K]; } & T;
