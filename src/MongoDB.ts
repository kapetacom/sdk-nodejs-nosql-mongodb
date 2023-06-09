import Config, { ConfigProvider, ResourceInfo } from '@kapeta/sdk-config';
import { MongoClient as Mongo } from 'mongodb';

const RESOURCE_DB_KIND = 'kapeta/resource-type-mongodb';
const PORT_TYPE = 'mongodb';

export class MongoDB {
    private readonly _resourceName: string;
    private _ready: boolean = false;
    private _dbName?: string;
    private _mongoInfo?: ResourceInfo;
    private _client?: Mongo;
    /**
     * Initialise mongo client for database.
     * @param {string} resourceName
     */
    constructor(resourceName: string) {
        this._resourceName = resourceName;

        //Add init method to startup sequence
        Config.onReady(async (provider: ConfigProvider) => {
            await this.init(provider);
        });
    }

    /**
     * Called automatically during startup sequence.
     *
     * @param {ConfigProvider} provider
     * @return {Promise<void>}
     */
    async init(provider: ConfigProvider) {
        this._mongoInfo = await provider.getResourceInfo(RESOURCE_DB_KIND, PORT_TYPE, this._resourceName);
        this._dbName =
            this._mongoInfo.options && this._mongoInfo.options.dbName
                ? this._mongoInfo.options.dbName
                : this._resourceName;
        const uri = this._getConnectionUri();
        this._client = await Mongo.connect(uri, {
            maxPoolSize: 10,
            appName: provider.getInstanceId(),
            auth: this._mongoInfo.credentials?.username
                ? {
                      username: this._mongoInfo.credentials?.username,
                      password: this._mongoInfo.credentials?.password,
                  }
                : undefined,
        });
        this._ready = true;
    }

    _getConnectionUri() {
        return 'mongodb://' + this._mongoInfo?.host + ':' + this._mongoInfo?.port;
    }

    /**
     *
     * @param {string} collection
     * @returns {Collection}
     * @memberof MongoClient
     */
    collection(collection: string) {
        return this.client().db(this._dbName).collection(collection);
    }

    /**
     *
     * @returns {Db}
     */
    db() {
        return this.client().db(this._dbName);
    }

    /**
     *
     * @returns {Client}
     */
    client() {
        if (!this._client) {
            throw new Error('MongoDB client not ready');
        }
        return this._client;
    }
}
