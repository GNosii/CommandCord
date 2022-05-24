/**
 * Moves the TypeScript definitions into the dist folder.
 * @author { ElNosii }
 */
const { copyFileSync, mkdirSync } = require("fs");
const { resolve } = require("path");

// index.d.ts - Public types
copyFileSync(resolve("src", "index.d.ts"), resolve("dist", "index.d.ts"));

// internal/index.d.ts - Private/internal types
mkdirSync(resolve("dist", "internal"));
copyFileSync(
	resolve("src", "internal.d.ts"),
	resolve("dist", "internal", "index.d.ts")
);
