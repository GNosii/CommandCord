/**
 * Moves the TypeScript definitions into the dist folder.
 * @author { ElNosii }
 */
const { copyFileSync, mkdirSync, renameSync, existsSync } = require("fs");
const { resolve } = require("path");

// index.d.ts - Public types
copyFileSync(resolve("src", "index.d.ts"), resolve("dist", "index.d.ts"));

// internal/index.js - Private/internal types
if (!existsSync(resolve("dist", "internal")))
	mkdirSync(resolve("dist", "internal"));

renameSync(
	resolve("dist", "internal.js"),
	resolve("dist", "internal", "index.js")
);
