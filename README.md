# CPSC 304 Group Project

## Project Description
This app helps beginners save money by tracking their groceries. It uses AI to suggest recipes based on what's in their kitchen, and users can share their inventory across multiple accounts. Users can also share their successful meals so the community can find recipes that actually work.

- You can find the milestone deliverables in the [milestones](milestones) folder.
- The frontend is in the [packages/frontend](packages/frontend) folder.
- The backend is in the [packages/backend](packages/backend) folder.
- The database migrations are in the [packages/sql/migrations](packages/sql/migrations) folder.
- The database setup script is in the [packages/scripts](packages/scripts) folder.

## Project setup

### Step 1: Install dependencies
```bash
npm install
```

### Step 2: Install PostgreSQL on your machine

> macOS (Homebrew)

```bash
brew install postgresql@17
brew services start postgresql@17
psql --version
```

### Step 3: Database Setup (PostgreSQL needs to be running)

This will:
- Create the database with database name `cpsc_304_project`
- Run the initial migration (runs `packages/sql/migrations/001_init.sql`)
- Insert demo data (runs `packages/scripts/test_data/test_insert.sql`)

```bash
chmod +x ./packages/scripts/db_setup.sh
./packages/scripts/db_setup.sh
```

## Running the project

### If you want to run frontend and backend at the same time
```bash
npm run dev
```

This will start both the frontend and backend servers.

### Or if you want to run frontend and backend separately

First run the backend:
```bash
npm run start:backend
```

Then open another terminal and run:
```bash
npm run start:frontend
```

- The frontend will be available at `http://localhost:5173`.
- The backend will be available at `http://localhost:3000`.

## Troubleshooting

### If you want to reset the database

You can first delete the database:
```bash
dropdb cpsc_304_project
```

Then run `db_setup.sh` again:
```bash
./packages/scripts/db_setup.sh
```

### If you want to run the test sqls in [packages/scripts/test_data/](packages/scripts/test_data/):

You can use `psql` command to run the sql files. e.g.:
```bash
psql -d cpsc_304_project -f packages/scripts/test_data/test_update.sql
```