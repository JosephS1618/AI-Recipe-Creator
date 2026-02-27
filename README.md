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


## Database Setup (PostgreSQL needs to be running)

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

