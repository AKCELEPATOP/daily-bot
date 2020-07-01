import {AnyObjectInterface} from './interfaces/any-object.interface';

export function promiseProps(obj: AnyObjectInterface): Promise<AnyObjectInterface> {
    const keys = Object.keys(obj);
    const values = Object.values(obj);
    return Promise.all(values)
        .then(resolved => {
            const res = {};
            for (let i = 0; i < keys.length; i++) {
                res[keys[i]] = resolved[i];
            }
            return res;
        });
}
