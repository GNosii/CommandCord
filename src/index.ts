import { randomUUID } from "crypto";
import { writeFile } from "fs";
import log from "npmlog";

/**
 * Waiting for https://nodejs.org/docs/latest-v17.x/api/globals.html#fetch to leave Experimental stability. 😴
 */
import { fetch, Headers, Response } from "undici";
import {
	Command,
	DiscordApplicationCommand,
	ApplicationCommandType,
	SubcommandGroup,
	BaseCommand,
	Option,
	DiscordApplicationCommandOption,
	ApplicationCommandOptionType,
	InitialObject,
} from "./internal";

let isDebugging: boolean;

/**
 * Deploy an object with valid CommandCord commands to Discord's API.
 * @param {object} content The commands that we should deploy.
 * @param {string} id The ID of your application as an string.
 * @param {string} token The token of your bot. Used for authentication with Discord.
 * @param {string} guild The ID of the development guild, if undefined, commands will be globally deployed.
 */
export function deploy(
	content: InitialObject,
	id: string,
	token: string,
	guild?: string,
	debug?: boolean
): void {
	let commands: DiscordApplicationCommand[] = [];

	isDebugging = debug ? debug : false;

	if (isDebugging)
		log.info(
			"Debug",
			"Debug output is enabled. Disable it by removing the -d option or not passing the debug parameter."
		);

	let endpoint = `https://discord.com/api/v10/applications/${id}/commands`;

	if (guild !== undefined && guild !== null) {
		endpoint = `https://discord.com/api/v10/applications/${id}/guilds/${guild}/commands`;
	}

	let array: Command[];

	if (content.commands !== undefined) {
		array = content.commands;
	} else {
		if (Array.isArray(content)) {
			array = content;
		} else {
			throw new ParseError(
				"'commands' needs to be an array of commands or an object with an 'commands' property.",
				["root"]
			);
		}
	}

	array.forEach((command: Command) => {
		doCommandChecks(command);

		//console.debug('Currently parsing', command);

		let current: DiscordApplicationCommand = {
			name: command.name.toLowerCase(),
			type: Number(ApplicationCommandType[command.type]),
			description: command.description,
			options: [],
		};

		if (command.subcommands !== undefined) {
			let groups = new Map<string, SubcommandGroup>();
			command.subcommands.forEach((subcommand) => {
				if (subcommand.options !== undefined) {
					let options: Option[] = getOptionsForObject(subcommand);
					subcommand.options = options;
				}

				if (subcommand.group !== undefined) {
					if (groups.has(subcommand.group)) {
						let group = groups.get(subcommand.group);
						group.children.push(subcommand);
					} else {
						let def: string | undefined =
							command.subcommandGroups[subcommand.group];
						if (def === undefined) {
							throw new ParseError(
								`Subcommand group ${subcommand.group} is not defined`,
								[command.name, subcommand.name]
							);
						}
						let group: SubcommandGroup = {
							name: subcommand.group.toLowerCase(),
							description: def,
							children: [subcommand],
						};
						groups.set(subcommand.group, group);
						return;
					}
				} else {
					let opt: DiscordApplicationCommandOption = <
						DiscordApplicationCommandOption
					>(<unknown>subcommand);
					opt.type = ApplicationCommandOptionType.subcommand;
					current.options.push(opt);
				}
			});
			groups.forEach((group) => {
				let opt: DiscordApplicationCommandOption = <
					DiscordApplicationCommandOption
				>group;
				opt.type = ApplicationCommandOptionType.subcommandGroup;
				opt.options = group.children;
				opt.options.map((sc) => {
					(sc.name = sc.name.toLowerCase()),
						(sc.type = ApplicationCommandOptionType.subcommand);
				});
				current.options.push(opt);
			});
		}

		if (command.options !== undefined) {
			current.options = getOptionsForObject(command);
		}

		commands.push(current);
	});

	sendData(endpoint, token, commands);
}

function sendData(
	endpoint: string,
	token: string,
	object: DiscordApplicationCommand[]
) {
	const headers: Headers = new Headers();

	headers.append("Content-Type", "application/json");
	headers.append("Authorization", "Bot " + token);

	if (isDebugging) {
		let random = randomUUID();
		writeFile(
			"commandcord-debugging-" + random + ".json",
			JSON.stringify(object),
			() => {
				log.info(
					"Debug",
					"Saved request body to commandcord-debugging-" + random + ".json"
				);
			}
		);
	}

	fetch(endpoint, {
		headers: headers,
		method: "PUT",
		body: JSON.stringify(object),
	})
		.then((res: Response) => {
			if (res.status !== 200) {
				log.error(
					"API",
					"The request did not complete successfully. %s",
					res.statusText
				);
			} else {
				log.info(
					"API",
					"Success! Your commands were deployed and should appear in Discord. Note, this may take a while."
				);
			}
		})
		.catch((err: Error) => {
			log.error("API", "Could not put commands. %s", err);
		});
}

function getOptionsForObject(object: BaseCommand): Option[] {
	let options: Option[] = [];

	object.options.forEach((option) => {
		if (ApplicationCommandOptionType[option.type] == undefined)
			throw new ParseError("Invalid option type " + option.type, [
				object.name,
				option.name,
			]);

		let obj: DiscordApplicationCommandOption = {
			name: option.name.toLowerCase(),
			type: Number(ApplicationCommandOptionType[option.type]), // Can't cast to an enum, this fixes that
			description: option.description,
			required: option.required === undefined ? true : option.required,
		};
		if (option.choices !== undefined) {
			obj.choices = option.choices;
		}
		options.push(obj);
	});

	return options;
}

function doCommandChecks(command: Command) {
	// Extracted from the Discord API: Using subcommands or subcommand groups will make your base command unusable.
	if (command.subcommands !== undefined && command.options !== undefined)
		throw new ParseError(
			"Commands cannot have subcommands and options at the same time",
			[command.name]
		);

	if (command.type === undefined)
		throw new ParseError("Missing required property 'type'", [command.name]);

	if (
		command.subcommands !== undefined &&
		<string>(<unknown>command.type) !== "slash"
	)
		throw new ParseError(
			"Command type " + command.type + " does not support subcommands.",
			[command.name]
		);

	if (
		command.description !== undefined &&
		<string>(<unknown>command.type) !== "slash"
	)
		throw new ParseError(
			"Command type " +
				command.type +
				" does not support the description property.",
			[command.name]
		);

	if (command.name !== command.name.toLowerCase())
		log.warn(
			"Parser",
			"Command name '" + command.name + "' is not lowercased."
		);

	if (
		command.subcommands === undefined &&
		command.subcommandGroups !== undefined
	)
		log.warn(
			"Parser",
			"Unnecessary property 'subcommandGroups'.",
			tracePath([command.name])
		);
}

function tracePath(path: string[]): string {
	return "at " + path.join(".");
}

class ParseError extends Error {
	constructor(message: string, path: string[]) {
		super(message + `\nLocated at: ${tracePath(path)}`);
	}
}
