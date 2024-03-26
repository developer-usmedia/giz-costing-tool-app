declare global {
    interface Document {
        env: {
            language?: string;
            version?: string;
            baseApi?: string;
        };
    }
}

export class Environment {
    production: boolean;
    baseApi: string;
    version: string;
    language: string;

    constructor(isProd: boolean) {
        const env = document.env ? document.env : {};

        this.production = isProd;
        this.language = env.language ?? 'en';
        this.version = env.version ?? 'n/a';
        this.baseApi = env.baseApi ?? '';
    }

    public get endpoints(): { [key: string]: string } {
        return {
            todo: this.baseApi + 'todo',
        };
    }
}
