declare global {
    interface Document {
        env: {
            [key: string]: boolean | string | number;
        };
    }
}

export class Environment {
    production: boolean;
    baseAPI: string;
    version: string;
    lang: string;

    constructor(isProd: boolean) {
        const envVars = document.env ? document.env : {};
        Object.assign(this, envVars);

        this.version = '1.0.0';
        this.production = isProd;
        this.lang = 'en';
        this.baseAPI = String(envVars["baseApi"]) ?? '';
    }

    public get endpoints(): { [key: string]: string } {
        return {
            todo: this.baseAPI + 'todo',
        };
    }
}
