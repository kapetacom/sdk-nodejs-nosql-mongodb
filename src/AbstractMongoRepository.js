const MongoClient = require('./MongoClient');

class AbstractMongoRepository {

    /**
     * Initialise mogodb dao
     *
     * @param {string} dbName
     */
    constructor(dbName) {
        this._dbName = dbName;
        this._client = new MongoClient(dbName);
    }

    async findById(id) {

    }

    async findAll() {

    }

    async insert(entity) {

    }

    async update(entity) {

    }

    async deleteById(id) {

    }
}


module.exports = AbstractMongoRepository;