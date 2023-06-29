import {ConfigProvider} from "@kapeta/sdk-config";
export const RESOURCE_TYPE = 'kapeta/resource-type-mongodb';
export const PORT_TYPE = 'mongodb';
export async function createDBURI(provider:ConfigProvider, resourceName: string) {
    const dbInfo = await provider.getResourceInfo(RESOURCE_TYPE, PORT_TYPE, resourceName);
    const dbName =
        dbInfo.options && dbInfo.options.dbName
            ? dbInfo.options.dbName
            : resourceName;

    let credentials = ''
    if (dbInfo.credentials?.username) {
        credentials += encodeURIComponent(dbInfo.credentials.username);

        if (dbInfo.credentials.password) {
            credentials += ':' + encodeURIComponent(dbInfo.credentials.password);
        }
    }

    return `mongodb://${credentials}@${dbInfo.host}:${dbInfo.port}/${encodeURIComponent(dbName)}?authSource=admin&directConnection=true`;
}