import {Inject, Injectable} from '@nestjs/common';
import * as child from 'child_process';
import * as readline from 'readline';
import * as path from 'path';
import {MY_STEM_MODULE_OPTIONS, TYPES} from './constants';
import {MyStemModuleOptionsInterface} from './interfaces';

@Injectable()
export class MyStemService {

    private readonly path: string;

    private mystemProcess: child.ChildProcess;

    private handlers: any[];

    constructor(
        @Inject(MY_STEM_MODULE_OPTIONS) params: MyStemModuleOptionsInterface,
    ) {
        // this.path = params.path || path.join(__dirname, '..', 'vendor', process.platform, 'mystem');
        this.path = params.path ? path.normalize(params.path) : '/mystem';
        this.handlers = [];

        // if (process.platform === 'win32') {
        //     this.path += '.exe';
        // }

        this.start();
    }

    private start() {
        if (this.mystemProcess) {
            return;
        }

        this.mystemProcess = child.spawn(this.path, ['--format', 'json', '--eng-gr', '-i']);
        const rd = readline.createInterface({input: this.mystemProcess.stdout, terminal: true});

        rd.on('line', (line) => {
            const handler = this.handlers.shift();

            if (handler) {
                const data = JSON.parse(line);
                handler.resolve(this.getGrammemes(data) || handler.word);
            }
        });

        this.mystemProcess.on('error', (err) => {
            const handler = this.handlers.shift();

            if (handler) {
                handler.reject(err);
            }
        });

        process.on('exit', this.stop);
    }

    private stop() {
        if (this.mystemProcess) {
            this.mystemProcess.kill();
        }
    }

    extractAllGrammemes(word: string): Promise<any[]> {
        return this.callMyStem(word);
    }

    callMyStem(word: string): Promise<any[]> {
        return new Promise((resolve, reject) => {
            this.mystemProcess.stdin.write(word + '\n');

            this.handlers.push({
                resolve,
                reject,
                word,
            });
        });
    }

    private getGrammemes(data) {
        if (!data.length || !data[0]) {
            return;
        }

        return data.reduce((res, word) => {
            if (word.analysis.length) {
                const analysis = word.analysis[0];
                const [wordType, ...gr] = analysis.gr.split(',');
                if (TYPES.hasOwnProperty(wordType)) {
                    const type = TYPES[wordType];
                    res.push(new type(word.text, analysis.lex, gr));
                }

                return res;
            }
        }, []);
    }
}
