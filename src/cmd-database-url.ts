import Config from '@kapeta/sdk-config';

const RESOURCE_TYPE = 'kapeta/resource-type-mongodb';
const PORT_TYPE = 'mongodb';

//Disable any logging from the SDK
console.log = function() {}

async function resolveUrl(resourceName: string) {
    const provider = await Config.init(process.cwd(), '' );
    const dbInfo = await provider.getResourceInfo(RESOURCE_TYPE, PORT_TYPE, resourceName);
    const dbName =
        dbInfo.options && dbInfo.options.dbName
            ? dbInfo.options.dbName
            : resourceName;

    let credentials = ''
    if (dbInfo.credentials?.username) {
        credentials += dbInfo.credentials.username;

        if (dbInfo.credentials.password) {
            credentials += ':' + dbInfo.credentials.password;
        }
    }

    return `mongodb://${credentials}@${dbInfo.host}:${dbInfo.port}/${dbName}?authSource=admin&directConnection=true`;
}

if (!process.argv[2]) {
    console.error('Usage: resolve-mongodb-url <resource-name>');
    process.exit(1);
}

resolveUrl(process.argv[2]).then(url => {
    process.stdout.write(url);
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});