import {Injectable} from '@nestjs/common';
import {MyStemService} from './my-stem.service';
import {VerbType} from './types';
import constants from './properties/constants';

const {form: {pf}} = constants;

@Injectable()
export class AnalysisService {
    constructor(
        private readonly myStemService: MyStemService,
    ) {
    }

    async hasPfVerbs(line: string): Promise<boolean> {
        const info = await this.myStemService.extractAllGrammemes(line);
        for (const word of info) {
            if (word.form === pf) {
                return true;
            }
        }
        return false;
    }
}
