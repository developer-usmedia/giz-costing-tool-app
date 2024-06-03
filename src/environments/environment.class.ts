declare global {
    interface Document {
        env: {
            apiUrl?: string;
            version?: string;
            devTools?: string;
        };
    }
}

export class Environment {
    production: boolean;
    apiUrl: string;
    version: string;
    devTools: boolean;

    constructor(isProd: boolean) {
        const env = document.env ? document.env : {};

        this.production = isProd;
        this.apiUrl = env.apiUrl ?? '';
        this.version = env.version ?? 'n/a';
        this.devTools = env.devTools === 'true';
    }
}
