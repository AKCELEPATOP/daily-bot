import {Form, formDescriptor, Tran, tranDescriptor} from '../properties';

// todo если будет расширение нужно переработать логику
const propertiesMap = {
    tran: tranDescriptor,
    form: formDescriptor,
};

export class VerbType {
    public readonly tran?: Tran;

    public readonly form?: Form;

    constructor(
        public readonly word: string,
        public readonly lex: string,
        gr?: string[],
    ) {
        if (gr) {
            gr.forEach((prop) => {
                const [, , propName, value] = prop.match(/^(([a-z]+?)=)?([a-z0-9]*?)$/);
                if (propName) {
                    this[propName] = value;
                } else {
                    for (const [key, descriptor] of Object.entries(propertiesMap)) {
                        try {
                            descriptor.check(value);
                            this[key] = value;
                            // tslint:disable-next-line:no-empty
                        } catch (e) {}
                    }
                }
            });
        }
    }
}
