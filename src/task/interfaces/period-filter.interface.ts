import {DateTime} from 'luxon';

export interface PeriodFilterInterface {
    dateFrom?: DateTime;
    dateTo?: DateTime;
}
