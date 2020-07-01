export type I18nTranslateArgsType = Array<{
    [k: string]: any;
} | string> | {
    [k: string]: any;
};

export interface I18nTranslateOptionsInterface {
    lang?: string;
    args?: I18nTranslateArgsType;
}
