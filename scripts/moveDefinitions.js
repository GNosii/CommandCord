/**
 * Moves the TypeScript definitions into the dist folder.
 * @author { ElNosii }
 */
const { copyFileSync } = require("fs");
const { resolve } = require("path");

copyFileSync(resolve("src", "types.d.ts"), resolve("dist", "index.d.ts"));
