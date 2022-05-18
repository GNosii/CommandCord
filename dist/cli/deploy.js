#! /usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
exports.__esModule = true;
var promises_1 = require("fs/promises");
var npmlog_1 = __importStar(require("npmlog"));
var path_1 = require("path");
var __1 = require("..");
var argv = require("yargs")
    .scriptName("deploy")
    .usage("$0 -t token -i id -g guildid -f filename")
    .option("t", {
    alias: "token",
    describe: "Bot token for authenticating with Discord.",
    type: "string"
})
    .option("i", {
    alias: "applicationId",
    describe: "ID of your Discord application.",
    type: "string"
})
    .option("g", {
    alias: "guildId",
    describe: "Guild ID if you're deploying to an guild.",
    type: "string",
    "default": "null"
})
    .option("f", {
    alias: "filename",
    describe: "Name of the file we should deploy from.",
    type: "string",
    "default": "commands.json"
})
    .option("e", {
    alias: "useEnv",
    describe: "If true, CommandCord will get the token and IDs from your environment.",
    type: "boolean",
    "default": false
})
    .option("d", {
    hidden: true,
    alias: "outputDebug",
    type: "boolean",
    "default": false
}).argv;
var token = argv.token;
argv.token = null;
argv.t = null;
var id = argv.i;
argv.id = null;
argv.i = null;
var guild = argv.g;
argv.guild = null;
argv.g = null;
if (token == null && argv.e === false) {
    (0, npmlog_1.error)("CLI", "You need to use the -e option or pass your credentials via the -t and -i options!");
    process.exit(9);
}
else {
    if (argv.e) {
        token = process.env.COMMANDCORD_TOKEN;
        id = process.env.COMMANDCORD_APP_ID;
        if (token === undefined || id === undefined) {
            (0, npmlog_1.error)("CLI", "Environment variables COMMANDCORD_TOKEN and/or COMMANDCORD_APP_ID are missing");
            process.exit(9);
        }
    }
    (0, promises_1.readFile)((0, path_1.normalize)(argv.filename), {
        encoding: "utf8"
    })
        .then(function (content) {
        (0, __1.deploy)(JSON.parse(content), id, token, guild);
    })["catch"](function (err) {
        if (err.name === "TypeError")
            npmlog_1["default"].error("CLI", "Could not load %s due to an internal error: %s", argv.filename, err.toString());
        else
            npmlog_1["default"].error("CLI", "Could not load %s due to an parse error:", argv.filename, err.toString());
    });
}
