import Config, { ConfigProvider, ResourceInfo } from '@kapeta/sdk-config';
const RESOURCE_TYPE = 'kapeta/resource-type-mongodb';
const PORT_TYPE = 'mongodb';

interface PrismaClient {
    $connect(): Promise<void>;
    $disconnect(): Promise<void>;
}


export abstract class MongoDB<T extends PrismaClient> {
    private readonly _resourceName: string;
    private _ready: boolean = false;
    private _dbInfo?: ResourceInfo;
    private _dbName?: string;
    private _prisma?: T;
    constructor(resourceName:string) {
        this._resourceName = resourceName;
        Config.onReady(async (provider) => {
            await this.init(provider);
        });
    }

    abstract createClient(opts: any): T;

    async init(provider: ConfigProvider) {
        this._dbInfo = await provider.getResourceInfo(RESOURCE_TYPE, PORT_TYPE, this._resourceName);
        this._dbName =
            this._dbInfo.options && this._dbInfo.options.dbName
                ? this._dbInfo.options.dbName
                : this._resourceName;

        let credentials = '';
        if (this._dbInfo?.credentials?.username) {
            credentials += this._dbInfo.credentials.username;

            if (this._dbInfo.credentials.password) {
                credentials += ':' + this._dbInfo.credentials.password;
            }
        }

        const url = `mongodb://${credentials}@${this._dbInfo.host}:${this._dbInfo.port}/${this._dbName}?authSource=admin`;
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
