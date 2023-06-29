import Config, { ConfigProvider, ResourceInfo } from '@kapeta/sdk-config';
import {createDBURI} from "./utils";

interface PrismaClient {
    $connect(): Promise<void>;
    $disconnect(): Promise<void>;
}


export abstract class MongoDB<T extends PrismaClient> {
    private readonly _resourceName: string;
    private _ready: boolean = false;
    private _prisma?: T;
    constructor(resourceName:string) {
        this._resourceName = resourceName;
        Config.onReady(async (provider) => {
            await this.init(provider);
        });
    }

    abstract createClient(opts: any): T;

    async init(provider: ConfigProvider) {
        const url = createDBURI(provider, this._resourceName);
        console.log('Connecting to mongodb database: %s', url);

        this._prisma = this.createClient({
            datasources: {
                db: {
                    url
                },
            },
        });

        await this._prisma.$connect();
        console.log('Connected successfully to mongodb database: %s', url);
        this._ready = true;
    }

    get client():T {
        if (!this._ready) {
            throw new Error('MongoDB not ready');
        }

        return this._prisma!;
    }
}
