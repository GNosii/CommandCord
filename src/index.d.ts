import { InitialObject } from "./internal";

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
): void;
