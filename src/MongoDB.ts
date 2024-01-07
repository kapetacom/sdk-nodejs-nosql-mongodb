/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import Config, { ConfigProvider, ResourceInfo } from '@kapeta/sdk-config';
import {createDBURI} from "./utils";

interface PrismaClient {
    $connect(): Promise<void>;
    $disconnect(): Promise<void>;
}

/**
 * Create a mongodb client and connect it to the database
 *
 * @param config the kapeta config provider
 * @param resourceName the resource name within the block
 * @param createClient a function that creates the prisma client
 */
export const createMongoDBClient = async <T extends PrismaClient>(config:ConfigProvider, resourceName: string, createClient: (opts: any) => T) => {
    const url = await createDBURI(config, resourceName);
    console.log('Connecting to mongodb database: %s', resourceName);

    const prisma = createClient({
        datasources: {
            db: {
                url
            },
        },
    });

    await prisma.$connect();
    console.log('Connected successfully to mongodb database: %s', resourceName);
    return prisma;
}

/**
 * A base class for mongodb databases.
 *
 * See also {@link createMongoDBClient} which is the recommended way to create a postgres client.
 */
export abstract class MongoDB<T extends PrismaClient> {
    private readonly _resourceName: string;
    private _ready: boolean = false;
    private _prisma?: T;

    protected constructor(resourceName:string) {
        this._resourceName = resourceName;
        Config.onReady(async (provider) => {
            await this.init(provider);
        });
    }

    abstract createClient(opts: any): T;

    async init(provider: ConfigProvider) {
        this._prisma = await createMongoDBClient(provider, this._resourceName, this.createClient);
        this._ready = true;
    }

    get client():T {
        if (!this._ready) {
            throw new Error('MongoDB not ready');
        }

        return this._prisma!;
    }
}
