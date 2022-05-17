#! /usr/bin/env node

import { readFile } from "fs/promises";
import npmlog, { error, log } from "npmlog";
import { normalize } from "path";
import { isNullOrUndefined } from "util";
import { deploy } from "..";

var { argv } = require("yargs")
	.scriptName("deploy")
	.usage("$0 -t token -i id -g guildid -f filename")
	.option("t", {
		alias: "token",
		describe: "Bot token for authenticating with Discord.",
		type: "string",
	})
	.option("i", {
		alias: "applicationId",
		describe: "ID of your Discord application.",
		type: "string",
	})
	.option("g", {
		alias: "guildId",
		describe: "Guild ID if you're deploying to an guild.",
		type: "string",
		default: "null",
	})
	.option("f", {
		alias: "filename",
		describe: "Name of the file we should deploy from.",
		type: "string",
		default: "commands.json",
	})
	.option("e", {
		alias: "useEnv",
		describe:
			"If true, CommandCord will get the token and IDs from your environment.",
		type: "boolean",
		default: false,
	})
	.option("d", {
		hidden: true,
		alias: "outputDebug",
		type: "boolean",
		default: false,
	});

let token = argv.token;
argv.token = null;
argv.t = null;

let id = argv.i;
argv.id = null;
argv.i = null;

let guild = argv.g;
argv.guild = null;
argv.g = null;

if (token == null && argv.e === false) {
	error(
		"CLI",
		"You need to use the -e option or pass your credentials via the -t and -i options!"
	);
	process.exit(9);
} else {
	if (argv.e) {
		token = process.env.COMMANDCORD_TOKEN;
		id = process.env.COMMANDCORD_APP_ID;
		if (token === undefined || id === undefined) {
			error(
				"CLI",
				"Environment variables COMMANDCORD_TOKEN and/or COMMANDCORD_APP_ID are missing"
			);
			process.exit(9);
		}
	}

	readFile(normalize(argv.filename), {
		encoding: "utf8",
	})
		.then((content: string) => {
			deploy(JSON.parse(content), id, token, guild);
		})
		.catch((err: Error) => {
			if (err.name === "TypeError")
				npmlog.error(
					"CLI",
					"Could not load %s due to an internal error: %s",
					argv.filename,
					err.toString()
				);
			else
				npmlog.error(
					"CLI",
					"Could not load %s due to an parse error:",
					argv.filename,
					err.toString()
				);
		});
}
