# Aitika Backend

## Project Setup

```bash
$ git clone git@github.com:mohsengreenlab/aitika.git
```

```bash
$ cd aitika
```

```bash
$ npm install
```

## Env

Create `.env` from `.env.example`:

```bash
$ cp .env.example .env
```

Make sure `.env` contains a correct Prisma connection string:

```bash
DATABASE_URL="postgresql://<DB_USER>:<DB_PW>@<DB_HOST>:<DB_PORT>/<DB_NAME>?schema=public"
```

## Docker

Currently, Docker is used ONLY for dependencies (PostgreSQL, pgAdmin, etc).  
The NestJS application itself **does not run** inside Docker.

Start development dependencies:

```bash
$ npm run devdockerup
```

or the raw Docker Compose command:

```bash
$ docker compose -f docker-compose.dev.yaml up -d --build
```

You will get pgAdmin at `PG_ADMIN_PORT`, and postgreSql at `DB_PORT`.
Hardcoded credentials for pgAdmin in (only used in dev):

```
PGADMIN_DEFAULT_EMAIL: admin@example.com
PGADMIN_DEFAULT_PASSWORD: adminpass
```

Generate the Prisma Client (needed whenever schema is changed):

```bash
$ npx prisma generate
```

Apply database migrations (creates tables in your dev database):

```bash
$ npx prisma migrate dev --name init
```

Note: migrations already exist in prisma/migrations/, so Prisma will apply them to your current database.
If you need a fresh database, remove Docker volumes and rerun migrations(ONLY IN DEV/TEST).

## Compile and run the project

```bash

# development

$ npm run start

# watch mode (recommended)

$ npm run start:dev

# production mode

$ npm run start:prod
```

## Run tests

```bash

# unit tests

$ npm run test

# e2e tests

$ npm run test:e2e

# test coverage

$ npm run test:cov
```

## Scripts

Available scripts:

```json
{
  "devdockerup": "docker compose -f docker-compose.dev.yaml up -d",
  "devdockerdown": "docker compose -f docker-compose.dev.yaml down --remove-orphans",
  "testdockerup": "docker compose -f docker-compose.test.yaml up -d",
  "testdockerdown": "docker compose -f docker-compose.test.yaml down -v --remove-orphans",
  "build": "nest build",
  "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
  "start": "nest start",
  "start:dev": "nest start --watch",
  "start:debug": "nest start --debug --watch",
  "start:prod": "node dist/main",
  "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
  "test": "jest",
  "test:watch": "jest --watch",
  "test:cov": "jest --coverage",
  "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
  "test:e2e": "jest --config ./test/e2e/jest-e2e.json"
}
```
