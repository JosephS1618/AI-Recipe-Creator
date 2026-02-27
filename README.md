# CPSC 304 Group Project

## Project Description


## Project setup

```bash
$ npm install
```

## Running the project

```bash
$ npm run dev
```

This will start both the frontend and backend servers.
- The frontend will be available at `http://localhost:5173`.
- The backend will be available at `http://localhost:3000`.

<br>

## Database Setup (PostgreSQL needs to be running)

## Creates the database, runs the initial migration and add a demo account

```bash
chmod +x scripts/db_setup.sh
./scripts/db_setup.sh

## Create the database

``` bash
createdb cpsc_304_project
```

## Run schema migration

``` bash
psql -d cpsc_304_project -f sql/migrations/001_init.sql
```

This should creates all the tables, types, constraints & relationships etc

## Inserting test data (just adds a "demo" account to the account relation)

``` bash
psql -d cpsc_304_project -f sql/test_data/test_insert.sql
```

This inserts demo data for development.

