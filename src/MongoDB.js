const Config = require('@blockware/sdk-config');
const {MongoClient:Mongo} = require('mongodb');
const RESOURCE_TYPE = "nosqldb.blockware.com/v1/mongodb";
const PORT_TYPE = "mongodb";

class MongoDB {

    /**
     * Initialise mongo client for database.
     *
     * @param {string} dbName
     */
    constructor(dbName) {
        this._dbName = dbName;
        this._ready = false;
        this._mongoInfo = null;
        this._client = null;

        //Add init method to startup sequence
        Config.onReady(async (provider) => {
            await this.init(provider);
        });
    }

    /**
     * Called automatically during startup sequence.
     *
     * @param {ConfigProvider} provider
     * @return {Promise<void>}
     */
    async init(provider) {
        this._mongoInfo = await provider.getResourceInfo(RESOURCE_TYPE, PORT_TYPE);

        const uri = this._getConnectionUri();

        this._client = await Mongo.connect(uri, {
            poolSize: 10,
            appname: provider.getInstanceId(),
            useNewUrlParser: true,
            auth: {
                user: this._mongoInfo.credentials.username,
                password: this._mongoInfo.credentials.password
            }
        });

        this._ready = true;

        console.log('MongoDB client ready for %s --> %s:%s', this._dbName, this._mongoInfo.host, this._mongoInfo.port);
    }


    _getConnectionUri() {
        return 'mongodb://' + this._mongoInfo.host + ':' + this._mongoInfo.port;
    }

    async findFirst(mongoQuery) {

    }

    async findAll(mongoQuery) {

    }

    async deleteFirst(mongoQuery) {

    }

    async deleteMulti(mongoQuery) {

    }

    async updateFirst(mongoQuery, updateStatement) {

    }

    async updateMulti(mongoQuery, updateStatement) {

    }
}


module.exports = MongoDB;