"use strict";
exports.__esModule = true;
exports.ChannelType =
	exports.ApplicationCommandType =
	exports.ApplicationCommandOptionType =
		void 0;
//#region CommandCord Types -> Discord Types
/**
 * @see {@link https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-type}
 */
var ApplicationCommandOptionType;
(function (ApplicationCommandOptionType) {
	ApplicationCommandOptionType[
		(ApplicationCommandOptionType["subcommand"] = 1)
	] = "subcommand";
	ApplicationCommandOptionType[
		(ApplicationCommandOptionType["subcommandGroup"] = 2)
	] = "subcommandGroup";
	ApplicationCommandOptionType[(ApplicationCommandOptionType["string"] = 3)] =
		"string";
	ApplicationCommandOptionType[(ApplicationCommandOptionType["integer"] = 4)] =
		"integer";
	ApplicationCommandOptionType[(ApplicationCommandOptionType["boolean"] = 5)] =
		"boolean";
	ApplicationCommandOptionType[(ApplicationCommandOptionType["user"] = 6)] =
		"user";
	ApplicationCommandOptionType[(ApplicationCommandOptionType["channel"] = 7)] =
		"channel";
	ApplicationCommandOptionType[(ApplicationCommandOptionType["role"] = 8)] =
		"role";
	ApplicationCommandOptionType[
		(ApplicationCommandOptionType["mentionable"] = 9)
	] = "mentionable";
	ApplicationCommandOptionType[(ApplicationCommandOptionType["number"] = 10)] =
		"number";
})(
	(ApplicationCommandOptionType =
		exports.ApplicationCommandOptionType ||
		(exports.ApplicationCommandOptionType = {}))
);
/**
 * @see {@link https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-types}
 */
var ApplicationCommandType;
(function (ApplicationCommandType) {
	ApplicationCommandType[(ApplicationCommandType["slash"] = 1)] = "slash";
	ApplicationCommandType[(ApplicationCommandType["user"] = 2)] = "user";
	ApplicationCommandType[(ApplicationCommandType["message"] = 3)] = "message";
})(
	(ApplicationCommandType =
		exports.ApplicationCommandType || (exports.ApplicationCommandType = {}))
);
/**
 * @see {@link https://discord.com/developers/docs/resources/channel#channel-object-channel-types}
 */
var ChannelType;
(function (ChannelType) {
	ChannelType[(ChannelType["text"] = 0)] = "text";
	ChannelType[(ChannelType["dm"] = 1)] = "dm";
	ChannelType[(ChannelType["voice"] = 2)] = "voice";
	ChannelType[(ChannelType["groupDm"] = 3)] = "groupDm";
	ChannelType[(ChannelType["category"] = 4)] = "category";
	ChannelType[(ChannelType["news"] = 5)] = "news";
	ChannelType[(ChannelType["threadNews"] = 10)] = "threadNews";
	ChannelType[(ChannelType["threadPublic"] = 11)] = "threadPublic";
	ChannelType[(ChannelType["threadPrivate"] = 12)] = "threadPrivate";
	ChannelType[(ChannelType["stage"] = 13)] = "stage";
	ChannelType[(ChannelType["directory"] = 14)] = "directory";
	ChannelType[(ChannelType["forum"] = 15)] = "forum";
})((ChannelType = exports.ChannelType || (exports.ChannelType = {})));
//#endregion
