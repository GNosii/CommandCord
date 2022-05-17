"use strict";
var __extends =
	(this && this.__extends) ||
	(function () {
		var extendStatics = function (d, b) {
			extendStatics =
				Object.setPrototypeOf ||
				({ __proto__: [] } instanceof Array &&
					function (d, b) {
						d.__proto__ = b;
					}) ||
				function (d, b) {
					for (var p in b)
						if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
				};
			return extendStatics(d, b);
		};
		return function (d, b) {
			if (typeof b !== "function" && b !== null)
				throw new TypeError(
					"Class extends value " + String(b) + " is not a constructor or null"
				);
			extendStatics(d, b);
			function __() {
				this.constructor = d;
			}
			d.prototype =
				b === null
					? Object.create(b)
					: ((__.prototype = b.prototype), new __());
		};
	})();
var __importDefault =
	(this && this.__importDefault) ||
	function (mod) {
		return mod && mod.__esModule ? mod : { default: mod };
	};
exports.__esModule = true;
exports.deploy = void 0;
var crypto_1 = require("crypto");
var fs_1 = require("fs");
var npmlog_1 = __importDefault(require("npmlog"));
/**
 * Waiting for https://nodejs.org/docs/latest-v17.x/api/globals.html#fetch to leave Experimental stability. 😴
 */
var undici_1 = require("undici");
var types_1 = require("./types");
var isDebugging;
/**
 * Deploy an object with valid CommandCord commands to Discord's API.
 * @param {object} content The commands that we should deploy.
 * @param {string} id The ID of your application as an string.
 * @param {string} token The token of your bot. Used for authentication with Discord.
 * @param {string} guild The ID of the development guild, if undefined, commands will be globally deployed.
 */
function deploy(content, id, token, guild, debug) {
	var commands = [];
	isDebugging = debug ? debug : true;
	if (isDebugging)
		npmlog_1["default"].info(
			"Debug",
			"Debug output is enabled. Disable it by removing the -d option."
		);
	var endpoint = "https://discord.com/api/v10/applications/".concat(
		id,
		"/commands"
	);
	if (guild !== undefined && guild !== null) {
		endpoint = "https://discord.com/api/v10/applications/"
			.concat(id, "/guilds/")
			.concat(guild, "/commands");
	}
	var array;
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
	array.forEach(function (command) {
		doCommandChecks(command);
		//console.debug('Currently parsing', command);
		var current = {
			name: command.name.toLowerCase(),
			type: Number(types_1.ApplicationCommandType[command.type]),
			description: command.description,
			options: [],
		};
		if (command.subcommands !== undefined) {
			var groups_1 = new Map();
			command.subcommands.forEach(function (subcommand) {
				if (subcommand.options !== undefined) {
					var options = getOptionsForObject(subcommand);
					subcommand.options = options;
				}
				if (subcommand.group !== undefined) {
					if (groups_1.has(subcommand.group)) {
						var group = groups_1.get(subcommand.group);
						group.children.push(subcommand);
					} else {
						var def = command.subcommandGroups[subcommand.group];
						if (def === undefined) {
							throw new ParseError(
								"Subcommand group ".concat(subcommand.group, " is not defined"),
								[command.name, subcommand.name]
							);
						}
						var group = {
							name: subcommand.group.toLowerCase(),
							description: def,
							children: [subcommand],
						};
						groups_1.set(subcommand.group, group);
						return;
					}
				} else {
					var opt = subcommand;
					opt.type = types_1.ApplicationCommandOptionType.subcommand;
					current.options.push(opt);
				}
			});
			groups_1.forEach(function (group) {
				var opt = group;
				opt.type = types_1.ApplicationCommandOptionType.subcommandGroup;
				opt.options = group.children;
				opt.options.map(function (sc) {
					(sc.name = sc.name.toLowerCase()),
						(sc.type = types_1.ApplicationCommandOptionType.subcommand);
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
exports.deploy = deploy;
function sendData(endpoint, token, object) {
	var headers = new undici_1.Headers();
	headers.append("Content-Type", "application/json");
	headers.append("Authorization", "Bot " + token);
	if (isDebugging) {
		var random_1 = (0, crypto_1.randomUUID)();
		(0, fs_1.writeFile)(
			"commandcord-debugging-" + random_1 + ".json",
			JSON.stringify(object),
			function () {
				npmlog_1["default"].info(
					"Debug",
					"Saved request body to commandcord-debugging-" + random_1 + ".json"
				);
			}
		);
	}
	(0, undici_1.fetch)(endpoint, {
		headers: headers,
		method: "PUT",
		body: JSON.stringify(object),
	})
		.then(function (res) {
			if (res.status !== 200) {
				npmlog_1["default"].error(
					"API",
					"The request did not complete successfully. %s",
					res.statusText
				);
			} else {
				npmlog_1["default"].info(
					"API",
					"Success! Your commands were deployed and should appear in Discord. Note, this may take a while."
				);
			}
		})
		["catch"](function (err) {
			npmlog_1["default"].error("API", "Could not put commands. %s", err);
		});
}
function getOptionsForObject(object) {
	var options = [];
	object.options.forEach(function (option) {
		if (types_1.ApplicationCommandOptionType[option.type] == undefined)
			throw new ParseError("Invalid option type " + option.type, [
				object.name,
				option.name,
			]);
		var obj = {
			name: option.name.toLowerCase(),
			type: Number(types_1.ApplicationCommandOptionType[option.type]),
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
function doCommandChecks(command) {
	// Extracted from the Discord API: Using subcommands or subcommand groups will make your base command unusable.
	if (command.subcommands !== undefined && command.options !== undefined)
		throw new ParseError(
			"Commands cannot have subcommands and options at the same time",
			[command.name]
		);
	if (command.type === undefined)
		throw new ParseError("Missing required property 'type'", [command.name]);
	if (command.name !== command.name.toLowerCase())
		npmlog_1["default"].warn(
			"Parser",
			"Command name '" + command.name + "' is not lowercased."
		);
	if (
		command.subcommands === undefined &&
		command.subcommandGroups !== undefined
	)
		npmlog_1["default"].warn(
			"Parser",
			"Unnecessary property 'subcommandGroups'.",
			tracePath([command.name])
		);
}
function tracePath(path) {
	return "at " + path.join(".");
}
var ParseError = /** @class */ (function (_super) {
	__extends(ParseError, _super);
	function ParseError(message, path) {
		return (
			_super.call(this, message + "\nLocated at: ".concat(tracePath(path))) ||
			this
		);
	}
	return ParseError;
})(Error);
