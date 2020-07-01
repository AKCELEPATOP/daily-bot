import { Literal, Union, Static } from 'runtypes';
import {objectToUnion} from './helpers';
import constants from './constants';
const {tran} = constants;

// export const tranDescriptor = Union(
//     Literal('inf'),
//     Literal('partcp'),
//     Literal('indic'),
//     Literal('imper'),
// );
export const tranDescriptor = objectToUnion(tran);

export type Tran = Static<typeof tranDescriptor>;
