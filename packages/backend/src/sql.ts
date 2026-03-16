import "./env";
import postgres from "postgres";

const DATABASE_URL =
	process.env.DATABASE_URL ?? "postgres://localhost:5432/cpsc_304_project";

export const sql = postgres(DATABASE_URL);
