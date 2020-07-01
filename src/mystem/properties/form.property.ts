import {Static} from 'runtypes';
import {objectToUnion} from './helpers';
import constants from './constants';
const {form} = constants;

// export const formDescriptor = Union(
//     Literal('ipf'),
//     Literal('pf'),
// );
export const formDescriptor = objectToUnion(form);

export type Form = Static<typeof formDescriptor>;
