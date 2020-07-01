import { Literal, Union, Static } from 'runtypes';
import {objectToUnion} from './helpers';
import constants from './constants';
const {types} = constants;

// export const typeDescriptor = Union(
//     Literal('V'),
//     Literal('S'),
//     Literal('ADV'),
// );
export const typeDescriptor = objectToUnion(types);

export type Type = Static<typeof typeDescriptor>;
