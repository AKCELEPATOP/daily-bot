import {AnyObjectInterface} from '../../common/interfaces/any-object.interface';

export type Constructable<ClassInstance> = new (...args: any[]) => ClassInstance;

export type SubType<Base, Cond> = Pick<Base, {
    [Key in keyof Base]: Base[Key] extends Cond ? Key : never
}[keyof Base]>;

export type KeyOf<MT extends object> = Extract<keyof MT, string>;

// не получилось создать фильтр только для объектов класса
export type RelationKeyOf<MT extends object = AnyObjectInterface> = KeyOf<SubType<MT, object>>;

export type Relations<MT extends object = AnyObjectInterface> = Array<RelationKeyOf<MT>>;

export type Direction = 'ASC' | 'DESC';

export type Order<MT extends object = AnyObjectInterface> = { [P in keyof MT]: Direction };

export type ShortHandEqualType = string | number | boolean | Date;

export type Condition<MT extends object> = {
    [P in KeyOf<MT>]?:
    | (MT[P] & ShortHandEqualType); // {key: 'value'}
};

export interface AndClause<MT extends object> {
    and: Array<Where<MT>>;
}

export interface OrClause<MT extends object> {
    or: Array<Where<MT>>;
}

export type Where<MT extends object = AnyObjectInterface> =
    | Condition<MT>
    | AndClause<MT>
    | OrClause<MT>;

export interface SelectBuilderOptionsInterface<MT extends object = AnyObjectInterface> {
    /**
     * Include related objects
     */
    relations?: Relations<MT>;
    /**
     * Sorting order for matched entities.
     */
    order?: Array<Order<MT>>;
    /**
     * The matching criteria
     */
    where?: Array<Where<MT>>;
    /**
     * Maximum number of entities
     */
    take?: number;
    /**
     * Skip N number of entities
     */
    skip?: number;
}
