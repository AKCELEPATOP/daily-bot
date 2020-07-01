import {PeriodFilterInterface} from './period-filter.interface';

export interface TaskFilterInterface {
    groupId?: number;
    userId?: number;
    period?: PeriodFilterInterface;
    teamId?: number;
}
