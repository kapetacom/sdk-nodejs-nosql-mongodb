# NodeJS Mongo support for the Kapeta project

Creates a client using Prisma and connects to a MongoDB database.

Is meant to be used with Kapeta and resources defined in a NodeJS Kapeta block.

Uses Prisma to make it simple to work with MongoDB from Kapeta - and
adds support for DB migrations.

Also exposes a CLI tool called ```kap-mongodb-url``` that can be used
to generate a Mongo database URL from within a Kapeta block - for a given environment.

To learn more about Kapeta, visit [kapeta.com](https://kapeta.com).

## Usage

This library exposes a class and function that can be used to create a client. 

Normal usage is generated using Kapeta - but it can also be used directly.

### `createMongoDBClient`
Async function that creates a client using Prisma and connects to a MongoDB database

### `MongoDB`
Class that creates a client using Prisma and connects to a MongoDB database. 
It will auto-initialize once the configuration provider is ready.
