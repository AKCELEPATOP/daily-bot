import {BaseMessage} from '../../messages/base/base.message';

export type TypeOfClassMethod<T, M extends keyof T> = T[M] extends (...args: any) => any ? T[M] : never;

export type SetMessageParams<T extends BaseMessage> = Parameters<TypeOfClassMethod<T, 'setParams'>>;
