import {TaskGroupCode} from '../../../task-group/task-group.enum';

export enum AdditionalTaskCode {
    POSTPONED = 'postponed',
}

export type TaskStatusEnum = TaskGroupCode | AdditionalTaskCode;
// tslint:disable-next-line:variable-name
export const TaskStatus = {...TaskGroupCode, ...AdditionalTaskCode};
