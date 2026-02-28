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

## Install PostgreSQL

> macOS (Homebrew)

```bash
brew install postgresql
brew services start postgresql
psql --version
```

## Database Setup (PostgreSQL needs to be running)

> Run these commands from the `packages/` directory.

This will:
- Create the database
- Run the initial migration
- Insert a demo account

```bash
chmod +x scripts/db_setup.sh
./scripts/db_setup.sh
```

> Running individual scripts

```bash
psql -d name_of_database -f name_of_script.sql
```


