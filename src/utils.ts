/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import {ConfigProvider} from "@kapeta/sdk-config";
export const RESOURCE_TYPE = 'kapeta/resource-type-mongodb';
export const PORT_TYPE = 'mongodb';
export async function createDBURI(provider:ConfigProvider, resourceName: string) {
    const dbInfo = await provider.getResourceInfo(RESOURCE_TYPE, PORT_TYPE, resourceName);
    console.log("resourceName", resourceName, dbInfo);
    if (!dbInfo) {
        throw new Error(`Resource ${resourceName} not found`);
    }
    const dbName =
        dbInfo.options && dbInfo.options.dbName
            ? dbInfo.options.dbName
            : resourceName;
    const protocol = dbInfo.options && dbInfo.options.protocol ? dbInfo.options.protocol : 'mongodb';

    let credentials = ''
    if (dbInfo.credentials?.username) {
        credentials += encodeURIComponent(dbInfo.credentials.username);

        if (dbInfo.credentials.password) {
            credentials += ':' + encodeURIComponent(dbInfo.credentials.password);
        }
    }

    if (protocol == 'mongodb+srv') {
        const result = `mongodb+srv://${credentials}@${dbInfo.host}/${encodeURIComponent(dbName)}?authSource=admin`;
        console.log("mongo db url", result);
        return result;
    } else {
        return `mongodb://${credentials}@${dbInfo.host}:${dbInfo.port}/${encodeURIComponent(dbName)}?authSource=admin&directConnection=true`;
    }
}