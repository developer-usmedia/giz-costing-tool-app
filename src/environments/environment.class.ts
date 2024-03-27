declare global {
    interface Document {
        env: {
            apiUrl?: string;
            version?: string;
        };
    }
}

export class Environment {
    production: boolean;
    apiUrl: string;
    version: string;

    constructor(isProd: boolean) {
        const env = document.env ? document.env : {};

        this.production = isProd;
        this.apiUrl = env.apiUrl ?? '';
        this.version = env.version ?? 'n/a';
    }

    public get endpoints(): { [key: string]: string } {
        return {
            todo: this.apiUrl + 'todo',
        };
    }
}
