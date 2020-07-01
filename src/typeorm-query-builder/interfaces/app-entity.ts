// export interface IsAppEntity {
//     imAUniqueSnowflake: true;
// }

// export type AppEntity =  IsAppEntity;

export interface IsAppEntity {
    isEntity: boolean;
}

export class AppEntity {
    private isEntity = true;
}
