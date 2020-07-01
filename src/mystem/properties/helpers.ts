import {Literal, Union} from 'runtypes';

export const objectToUnion = (obj) => {
    const literals = Object.values(obj).map((val: string) => Literal(val));
    // @ts-ignore
    return Union(...literals);
};
