//#region CommandCord Types -> Discord Types
/**
 * @see {@link https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-type}
 */
export enum ApplicationCommandOptionType {
	subcommand = 1,
	subcommandGroup = 2,
	string = 3,
	integer = 4,
	boolean = 5,
	user = 6,
	channel = 7,
	role = 8,
	mentionable = 9,
	number = 10,
}

/**
 * @see {@link https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-types}
 */
export enum ApplicationCommandType {
	slash = 1,
	user = 2,
	message = 3,
}

/**
 * @see {@link https://discord.com/developers/docs/resources/channel#channel-object-channel-types}
 */
export enum ChannelType {
	text = 0,
	dm = 1,
	voice = 2,
	groupDm = 3,
	category = 4,
	news = 5,
	threadNews = 10,
	threadPublic = 11,
	threadPrivate = 12,
	stage = 13,
	directory = 14,
	forum = 15,
}

//#endregion
//#region Option Interfaces

/**
 * @see {@link https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-choice-structure}
 */
interface Choice {
	/**
	 * Name of the choice
	 */
	name: string;

	/**
	 * Value for the choice
	 */
	value: string;
}

/**
 * @see {@link https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure}
 */
export interface Option {
	name: string;
	type: ApplicationCommandOptionType;
	description: string;
	required?: boolean;
	choices?: Choice[];
}

//#endregion
//#region Command Interfaces

export interface BaseCommand {
	name: string;
	type: ApplicationCommandType;
	description: string;
	options?: Option[];
}

export interface SubcommandGroup {
	name: string;
	description: string;
	children?: Subcommand[];
}

interface Subcommand extends BaseCommand {
	group?: string;
}

export interface Command extends BaseCommand {
	subcommandGroups?: {
		[groupName: string]: string;
	};
	subcommands?: Subcommand[];
}

export interface CommandChild {
	type: number;
}

//#endregion
//#region Discord Types
export interface DiscordApplicationCommandOptionChoice {
	name: string;
	value: string;
}

export interface DiscordApplicationCommandOption {
	name: string;
	type: number;
	description: string;
	required?: boolean;
	channel_types?: ChannelType[];
	options?: DiscordApplicationCommand[];
	choices?: DiscordApplicationCommandOptionChoice[];
}

export interface DiscordApplicationCommand {
	name: string;
	type: number;
	description: string;
	options?: DiscordApplicationCommandOption[];
}
//#endregion
//#region Misc Types
export type InitialObject = {
	commands?: Command[];
} & Command[];
//#endregion
