"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const neon_http_1 = require("drizzle-orm/neon-http");
const migrator_1 = require("drizzle-orm/neon-http/migrator");
const serverless_1 = require("@neondatabase/serverless");
const sql = (0, serverless_1.neon)(process.env.DATABASE_URL || "");
console.log(sql);
const db = (0, neon_http_1.drizzle)(sql);
const main = async () => {
    try {
        await (0, migrator_1.migrate)(db, {
            migrationsFolder: "src/db/migrations",
        });
        console.log("Migration successful");
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
};
main();
